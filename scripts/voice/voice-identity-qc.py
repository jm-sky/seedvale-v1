#!/usr/bin/env python3
"""CPU speaker identity evidence; never updates transcript or author verdicts."""
import argparse
import hashlib
import json
import math
import os
from pathlib import Path
from voice_assets import ARCHIVE, recording_path
from voice_decisions import load_decisions
import resource
import subprocess
import time

ROOT = Path(__file__).resolve().parents[2]
MODEL = 'speechbrain/spkrec-ecapa-voxceleb'


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def unit(values):
    norm = math.sqrt(sum(x*x for x in values))
    if not norm or not all(math.isfinite(x) for x in values):
        raise ValueError('Invalid embedding')
    return [x/norm for x in values]


def reference_name(path):
    return path.name.split('-2026-')[0]


def expected_identity(row, mapping, overrides):
    """Resolve reviewed per-content expectations before historical bank metadata."""
    override = overrides.get('recordings', {}).get(row.get('file'))
    if override is not None:
        if override['gitBlob'] != row.get('gitBlob'):
            raise ValueError(f"Stale identity override: {row['file']}")
        uuid = override['uuid']
        if uuid is not None and uuid not in mapping['voices'].values():
            raise ValueError(f'Unknown override UUID: {uuid}')
        if not override['evidence'] or override['status'] not in ('historical-verified', 'author-confirmed', 'unresolved'):
            raise ValueError('Override requires evidence and an explicit status')
        if (uuid is None) != (override['status'] == 'unresolved'):
            raise ValueError('Unresolved override must have null UUID')
        return dict(expectedUuid=uuid, expectedSource='override', expectedEvidence=override)
    value = row.get('voiceId')
    uuid = mapping['profiles'].get(value, value if value in mapping['voices'].values() else None)
    return dict(expectedUuid=uuid, expectedSource='ledger' if uuid else 'unknown-ledger')


def expected_uuid(row, mapping, overrides=None):
    return expected_identity(row, mapping, overrides or {})['expectedUuid']


class Cache:
    """Content-addressed embeddings, scoped to weights, dependencies and preprocessing."""
    def __init__(self, directory, version, extract):
        self.directory = directory / hashlib.sha256(version.encode()).hexdigest()
        self.directory.mkdir(parents=True, exist_ok=True)
        self.extract = extract
        self.hits = self.misses = 0

    def get(self, path):
        key = digest(path)
        dest = self.directory / (key + '.json')
        if dest.exists():
            result = json.loads(dest.read_text())
            unit(result['embedding'])
            self.hits += 1
        else:
            result = self.extract(path)
            result['embedding'] = unit(result['embedding'])
            temp = dest.with_suffix(f'.{os.getpid()}.tmp')
            temp.write_text(json.dumps(result, allow_nan=False))
            temp.replace(dest)
            self.misses += 1
        return key, result


def compare(target_hash, vector, references, expected):
    """Exclude identical bytes before pooling; retain every eligible raw cosine."""
    scores = {}
    pairs = []
    excluded = []
    for ref in references:
        if ref['sha256'] == target_hash:
            excluded.append(ref['file'])
            continue
        score = sum(a*b for a, b in zip(vector, ref['embedding'], strict=True))
        pairs.append({'file': ref['file'], 'uuid': ref['uuid'], 'cosine': score})
        scores.setdefault(ref['uuid'], []).append(score)
    # Mean over unique reference contents prevents repeated takes dominating a speaker.
    ranked = sorted(((sum(v)/len(v), k) for k, v in scores.items()), reverse=True)
    best, winner = ranked[0] if ranked else (None, None)
    return dict(bestUuid=winner, bestScore=best,
                expectedScore=sum(scores[expected])/len(scores[expected]) if expected in scores else None,
                margin=best-ranked[1][0] if len(ranked)>1 else None,
                voiceScores={k: sum(v)/len(v) for k, v in scores.items()},
                pairs=pairs, excludedIdentical=excluded,
                missingExpectedReference=expected not in scores)


def classify(row, policy):
    """Conservative local triage, never a speaker-identity proof or author verdict."""
    if 'error' in row:
        return 'analysis-error'
    if row.get('expectedUuid') is None:
        return 'unresolved-expected'
    if row['missingExpectedReference']:
        return 'missing-reference'
    if row['bestScore'] < policy['minScore'] or (row['margin'] or 0) < policy['minMargin']:
        return 'ambiguous'
    return 'strong-match' if row['bestUuid'] == row['expectedUuid'] else 'suspected-wrong-speaker'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--sample', type=Path, help='JSON list of ledger filenames; omit for all')
    parser.add_argument('--policy', type=Path, help='Locally calibrated triage policy JSON')
    parser.add_argument('--cache', type=Path, default=ROOT/'_temp/voice-identity')
    parser.add_argument('--threads', type=int, default=2)
    parser.add_argument('--overrides', type=Path, default=Path(__file__).with_name('voice-identity-overrides.json'))
    parser.add_argument('--cache-only', action='store_true', help='Fail on cache misses; never load the model or run inference')
    args = parser.parse_args()
    started = time.monotonic()
    policy = json.loads(args.policy.read_text()) if args.policy else None
    os.environ['CUDA_VISIBLE_DEVICES'] = ''
    os.environ['HF_HOME'] = str(args.cache/'huggingface')
    import importlib.metadata
    mapping_path = ROOT/'scripts/voice/voice-identity-map.json'
    mapping = json.loads(mapping_path.read_text())
    overrides = json.loads(args.overrides.read_text())
    model = None
    versions = {p: importlib.metadata.version(p) for p in ('torch','torchaudio','speechbrain','av','numpy','huggingface-hub')}
    version = json.dumps([MODEL, mapping['modelRevision'], versions, 'mono-16k-av-full-clip-v1'], sort_keys=True)

    def extract(path):
        nonlocal model
        if args.cache_only:
            raise ValueError(f'Embedding cache miss: {path}')
        import av
        import numpy as np
        import torch
        if model is None:
            from huggingface_hub import snapshot_download
            from speechbrain.inference.speaker import EncoderClassifier
            torch.set_num_threads(args.threads)
            snapshot = snapshot_download(MODEL, revision=mapping['modelRevision'])
            model = EncoderClassifier.from_hparams(source=snapshot, savedir=str(args.cache/'model'), run_opts={'device':'cpu'})
        resampler = av.AudioResampler(format='fltp', layout='mono', rate=16000)
        chunks = []
        with av.open(str(path)) as audio:
            for frame in audio.decode(audio=0):
                chunks.extend(f.to_ndarray().reshape(-1) for f in resampler.resample(frame))
            chunks.extend(f.to_ndarray().reshape(-1) for f in resampler.resample(None))
        samples = np.concatenate(chunks)
        if len(samples) < 1600:
            raise ValueError('Clip shorter than 100ms')
        with torch.inference_mode():
            vector = model.encode_batch(torch.from_numpy(samples).unsqueeze(0)).flatten().tolist()
        return {'embedding':vector, 'durationSec':len(samples)/16000}

    cache = Cache(args.cache/'embeddings', version, extract)
    references, errors, seen = [], [], set()
    for path in sorted((ARCHIVE/'named-references').glob('*.mp3')):
        uuid = mapping['voices'].get(reference_name(path))
        if not uuid:
            errors.append({'file':str(path.relative_to(ROOT)), 'error':'Unmapped reference name'})
            continue
        try:
            key, result = cache.get(path)
            if (key, uuid) not in seen:
                references.append(dict(file=str(path.relative_to(ROOT)), uuid=uuid, sha256=key, **result))
                seen.add((key, uuid))
        except Exception as error:
            errors.append({'file':str(path.relative_to(ROOT)), 'error':str(error)})
    ledger_path = ROOT/'docs/assets/voice-qc/ledger.json'
    rows = json.loads(ledger_path.read_text())['rows']
    decisions = load_decisions(rows)
    historical_path = ROOT/'docs/assets/voice-qc/identity-audit.json'
    historical = {r['file']: r for r in json.loads(historical_path.read_text())['rows']}
    if args.output.resolve() == historical_path.resolve() and any(e['disposition'] == 'replace' for e in decisions.values()):
        raise ValueError('Preserve the historical audit; use --output /tmp/voice-identity-current.json for migrated inventory QC')
    unknown_overrides = set(overrides['recordings']) - {r['file'] for r in rows}
    if unknown_overrides:
        raise ValueError(f'Unknown override files: {unknown_overrides}')
    selection = json.loads(args.sample.read_text()) if args.sample else None
    if selection:
        unknown = set(selection)-{r['file'] for r in rows}
        if unknown:
            raise ValueError(f'Unknown sample files: {unknown}')
        rows = [r for r in rows if r['file'] in selection]
    output, processed = [], {}
    for row in rows:
        if decisions[row['file']]['disposition'] == 'replace':
            # Scores describe the deleted original, never a new extraction or listening claim.
            output.append(dict(historical[row['file']], audioAvailability='removed-author-decision', historicalEvidence=True))
            continue
        path = recording_path(row['file'])
        record = dict(file=row['file'], ledgerVoiceId=row.get('voiceId'),
                      **expected_identity(row, mapping, overrides), ledgerGitBlob=row['gitBlob'])
        try:
            key, result = cache.get(path)
            actual_blob = subprocess.check_output(['git','hash-object',str(path)],text=True).strip()
            if actual_blob != row['gitBlob']:
                raise ValueError('Ledger gitBlob differs from audio')
            if key not in processed:
                processed[key] = compare(key,result['embedding'],references,record['expectedUuid'])
            # Expected voice may differ between aliases sharing bytes.
            evidence = compare(key,result['embedding'],references,record['expectedUuid'])
            public = ROOT/'public/sounds/voices'/row['file']
            record.update(sha256=key, durationSec=result['durationSec'], **evidence)
            record['publicCopyIdentical'] = digest(public)==key if public.exists() else None
            record['classification'] = classify(record, policy) if policy else 'unclassified'
        except Exception as error:
            record['error'] = str(error)
        output.append(record)
        print(f"{len(output)}/{len(rows)} {row['file']}", flush=True)
    usage = resource.getrusage(resource.RUSAGE_SELF)
    report = dict(policy=policy, schemaVersion=2, model=MODEL, revision=mapping['modelRevision'], versions=versions,
                  preprocessing='mono 16kHz full clip; no VAD', pooling='mean cosine per unique reference content per UUID',
                  mappingSha256=digest(mapping_path), ledgerSha256=digest(ledger_path), threads=args.threads,
                  overridesSha256=digest(args.overrides), modelInitialized=model is not None,
                  wallSec=time.monotonic()-started, cpuUserSec=usage.ru_utime, cpuSystemSec=usage.ru_stime,
                  peakRssKiB=usage.ru_maxrss, cacheHits=cache.hits, cacheMisses=cache.misses,
                  uniqueTargetContents=len(processed), referenceErrors=errors,
                  references=[{k:v for k,v in r.items() if k!='embedding'} for r in references],
                  referenceChecks=[dict(file=r['file'], expectedUuid=r['uuid'], durationSec=r['durationSec'],
                                        **compare(r['sha256'], r['embedding'], references, r['uuid'])) for r in references],
                  rows=output)
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(report,indent=2,allow_nan=False)+'\n')
    return int(any('error' in r for r in output))

if __name__ == '__main__':
    raise SystemExit(main())
