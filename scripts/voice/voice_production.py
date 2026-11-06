"""Bounded Fish production preparation; staged output never implies QC admission."""
import argparse
from collections import Counter
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import re
import sys
import time
import urllib.error
import urllib.request

from voice_assets import evidence_path
from voice_decisions import ROOT

RESEARCH = ROOT / 'docs/research/v1-revival'
Q90 = RESEARCH / '2026-11-04--q90-fish-audio-script.json'
NPC69 = RESEARCH / '2026-11-05--npc-069-production-manifest.json'
DECISIONS = ROOT / 'docs/assets/voice-qc/author-decisions.json'
STAGE = Path('/tmp/seedvale-voice-production')
MODELS = ('s1', 's2-pro', 's2.1-pro', 's2.1-pro-free', 'drama-3')
QSTATUS = 'text_author_approved_2026-11-04; generation_QC_binding_pending'
NSTATUSES = {'ready-to-order': 'record', 'reuse-QC-pending': 'reuse',
             'Q90-already-ordered': 'reuse', 'binding-held': 'held',
             'restoration-held': 'held', 'deferred-optional': 'deferred'}


class ProductionError(ValueError):
    """Controlled local diagnostic; never constructed from provider response text."""


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + '\n').encode()


def sha(data):
    return hashlib.sha256(data).hexdigest()


def read(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def require(condition, message):
    if not condition:
        raise ProductionError(message)


def load_jobs(qpath=Q90, npath=NPC69, decisions=DECISIONS):
    """Normalize only approved orders, retaining complete original rows and aliases."""
    q, n = read(qpath), read(npath)
    rejected = {k for k, v in read(decisions)['globalVoiceDecisions'].items()
                if v['decision'] == 'rejected'}
    jobs, ids, names, signatures = [], {}, set(), set()

    def add(row, batch, path, rid, voice, speaker, filename):
        require(isinstance(rid, str) and re.fullmatch(r'[A-Za-z0-9_-]+(?:\.mp3)?', rid), 'Unsafe recording ID')
        require(rid not in ids, f'Duplicate recording ID: {rid}')
        require(isinstance(filename, str) and re.fullmatch(r'[A-Za-z0-9_-]+\.mp3', filename),
                f'Unsafe MP3 filename: {rid}')
        require(filename not in names, f'Duplicate filename: {filename}')
        require(isinstance(voice, str) and re.fullmatch(r'[a-f0-9]{32}', voice), f'Invalid UUID: {rid}')
        require(voice not in rejected, f'Rejected speaker: {rid}')
        for field in ('generation_input', 'canonical_transcript'):
            require(isinstance(row.get(field), str) and row[field].strip(), f'Missing {field}: {rid}')
        signature = (voice, row['generation_input'])
        require(signature not in signatures, f'Duplicate voice/input: {rid}')
        require(row.get('priority') in ('P0', 'P1', 'P2'), f'Invalid priority: {rid}')
        job = dict(recording_id=rid, batch=batch, voice_uuid=voice, speaker=speaker,
                   filename=filename, generation_input=row['generation_input'],
                   canonical_transcript=row['canonical_transcript'], priority=row['priority'],
                   manifest=str(Path(path).relative_to(ROOT)) if Path(path).is_relative_to(ROOT) else str(path),
                   manifest_sha256=sha(Path(path).read_bytes()), original=row, aliases=[])
        # Identity excludes local delivery/inventory state; includes exact source context.
        job['job_sha256'] = sha(encoded(job))
        jobs.append(job)
        ids[rid] = job
        names.add(filename)
        signatures.add(signature)

    for row in q['recordings']:
        require(row['status'] == QSTATUS and row['disposition'] in ('new recording', 'replacement'),
                f'Unrecognized Q90 policy: {row.get("id")}')
        profile = q['profiles'][row['speaker']]
        require(row['fish_voice_id'] == profile['fish_voice_id'], 'Q90 casting mismatch')
        require(row.get('conditions') and row.get('binding_gate') and row.get('speaker_restrictions'),
                'Missing Q90 restrictions')
        add(row, 'Q90', qpath, row['id'], row['fish_voice_id'], row['speaker'], row['filename'])
    named_cast = {c['key']: c['voice'] for c in n['casting']}
    all_nids = set()
    for row in n['records']:
        rid, status = row['recording_id'], row['status']
        require(rid not in all_nids, f'Duplicate npc-069 ID: {rid}')
        all_nids.add(rid)
        require(status in NSTATUSES and row['disposition'] == NSTATUSES[status],
                f'Unrecognized npc-069 policy: {rid}')
        if status == 'Q90-already-ordered':
            require(rid in ids, f'Unresolved Q90 alias: {rid}')
            owner = ids[rid]
            for a, b in [('fish_voice_uuid', 'voice_uuid'), ('suggested_filename', 'filename'),
                         ('generation_input', 'generation_input'), ('canonical_transcript', 'canonical_transcript')]:
                require(row[a] == owner[b], f'Q90 alias differs: {rid}/{a}')
            owner['aliases'].append(row)
        elif status == 'ready-to-order':
            voice = row['fish_voice_uuid']
            if row['characterKey']:
                require(voice == named_cast[row['characterKey']], f'Named casting mismatch: {rid}')
            else:
                require(voice == '5e3be339f2df45e6a1a338bb2ce94800'
                        and row['generic_role'] == 'general_middle_female', 'Unapproved generic restoration')
            require(row.get('context_predicates') and row.get('runtime_gate') and row.get('source_file'),
                    f'Missing restrictions/source: {rid}')
            add(row, 'npc-069', npath, rid, voice, row['characterKey'] or row['generic_role'],
                row['suggested_filename'])
    summary = {'Q90_orders': len(q['recordings']),
               'manifest_sha256': {'Q90': sha(Path(qpath).read_bytes()), 'npc-069': sha(Path(npath).read_bytes())},
               'input_utf8_bytes': sum(len(j['generation_input'].encode('utf-8')) for j in jobs),
               'npc069_statuses': dict(sorted(Counter(
        r['status'] for r in n['records']).items())), 'unique_orders': len(jobs)}
    return sorted(jobs, key=lambda r: (r['priority'], r['batch'], r['recording_id'])), summary


def availability(jobs, stage, inventory=()):
    """Filename collisions block orders; filenames never establish a delivered identity."""
    roots = [ROOT / 'public/sounds/voices', ROOT / 'docs/archive/voice-donor', stage, *map(Path, inventory)]
    names = {p.name for root in roots if root.exists() for p in root.rglob('*.mp3')}
    for job in jobs:
        directory = stage / job['recording_id']
        job['availability'] = ('staged-or-attempted' if directory.exists() else
                               'inventory-collision' if job['filename'] in names else 'orderable')


def verify_reuse(path=NPC69):
    """Check retained content through the existing migration resolver, without changing QC."""
    rows = []
    for row in read(path)['records']:
        if row['status'] != 'reuse-QC-pending':
            continue
        p = evidence_path(row['asset_path'])
        require(p.is_file(), f'Missing reuse file: {row["recording_id"]}')
        require(sha(p.read_bytes()) == row['existing_sha256'], f'Stale reuse hash: {row["recording_id"]}')
        rows.append({'recording_id': row['recording_id'], 'sha256': row['existing_sha256'], 'qc': 'pending'})
    return rows


def mp3_info(data):
    """Check complete MPEG Layer III frames, tags and duration; this is not decoder/listening QC."""
    end, pos, frames, duration, rates, channels = len(data), 0, 0, 0.0, set(), set()
    if data.startswith(b'ID3'):
        require(len(data) >= 10 and data[3] in (2, 3, 4) and all(x < 128 for x in data[6:10]), 'Invalid ID3')
        size = sum(x << (7 * (3-i)) for i, x in enumerate(data[6:10]))
        pos = 10 + size + (10 if data[3] == 4 and data[5] & 16 else 0)
    if end >= 128 and data[-128:-125] == b'TAG':
        end -= 128
    while pos < end:
        require(pos + 4 <= end, 'Truncated MP3 header')
        h = int.from_bytes(data[pos:pos+4], 'big')
        version, layer, bi, si = (h >> 19) & 3, (h >> 17) & 3, (h >> 12) & 15, (h >> 10) & 3
        require(h >> 21 == 2047 and version != 1 and layer == 1 and 0 < bi < 15 and si < 3,
                'Invalid MPEG Layer III frame')
        rate = (44100, 48000, 32000)[si] // (1 if version == 3 else 2 if version == 2 else 4)
        table = (0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320) if version == 3 else (
            0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160)
        length = (144000 if version == 3 else 72000) * table[bi] // rate + ((h >> 9) & 1)
        require(pos + length <= end, 'Truncated MP3 frame')
        duration += (1152 if version == 3 else 576) / rate
        rates.add(rate)
        channels.add(1 if (h >> 6) & 3 == 3 else 2)
        frames += 1
        pos += length
    require(frames >= 2 and len(rates) == 1 and len(channels) == 1, 'Empty/inconsistent MP3')
    return dict(format='mp3', frames=frames, duration_seconds=round(duration, 6),
                sample_rate=rates.pop(), channels=channels.pop(), bytes=len(data), sha256=sha(data),
                validation='frame-structure-only; decoder and listening QC pending')


def safe_stage(path):
    path = Path(path).resolve()
    require(not path.is_relative_to(ROOT), 'Staging must be outside the repository/live bank')
    return path


def exclusive(path, data):
    """Publish an fsynced file atomically without replacing existing bytes."""
    temp = path.with_name(path.name + '.partial')
    with temp.open('xb') as f:
        f.write(data)
        f.flush()
        os.fsync(f.fileno())
    os.link(temp, path)
    temp.unlink()
    fd = os.open(path.parent, os.O_RDONLY)
    try:
        os.fsync(fd)
    finally:
        os.close(fd)


def event(directory, state, **fields):
    index = len(list(directory.glob('event-*.json')))
    exclusive(directory / f'event-{index:03d}.json', encoded(dict(state=state,
              at=datetime.now(timezone.utc).isoformat(), **fields)))


def reserve(stage, job, kind, details):
    stage = safe_stage(stage)
    stage.mkdir(parents=True, exist_ok=True)
    directory = stage / job['recording_id']
    directory.mkdir()  # exclusive reservation also serializes concurrent processes
    fd = os.open(stage, os.O_RDONLY)
    try:
        os.fsync(fd)  # persist the reservation before sending a billable request
    finally:
        os.close(fd)
    canonical = {k: v for k, v in job.items() if k != 'availability'}
    exclusive(directory / 'provenance.json', encoded(dict(job=canonical, kind=kind, details=details,
              qc='pending', listening_approved=False)))
    event(directory, 'reserved')
    return directory


def request_body(job):
    return dict(text=job['generation_input'], reference_id=job['voice_uuid'], format='mp3',
                sample_rate=44100, mp3_bitrate=128, latency='normal', normalize=False,
                temperature=0.7, top_p=0.7, chunk_length=300)


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None  # never forward credentials or silently repeat a POST


def fish_request(body, model, key):
    """One official REST request, with no transport retries or response/error logging."""
    request = urllib.request.Request('https://api.fish.audio/v1/tts', data=encoded(body),
        headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json', 'model': model})
    return urllib.request.build_opener(NoRedirect()).open(request, timeout=120)


def generate(job, stage, model, execute=False, retries=0, transport=fish_request, sleeper=time.sleep):
    require(model in MODELS, 'Explicit supported model required')
    if not execute:
        return dict(dry_run=True, job=job, model=model, request=request_body(job))
    require(job['availability'] == 'orderable', f'Blocked order: {job["recording_id"]}')
    key = os.environ.get('FISH_API_KEY')
    require(key and '\n' not in key and '\r' not in key, 'Set FISH_API_KEY in the environment')
    directory = reserve(stage, job, 'api', dict(model=model, request=request_body(job)))
    for attempt in range(retries + 1):
        event(directory, 'in-flight', attempt=attempt)
        received_response = False
        try:
            with transport(request_body(job), model, key) as response:
                received_response = True
                # Request ID is optional diagnostic evidence, never an idempotency guarantee.
                request_id = response.headers.get('x-request-id')
                if request_id and re.fullmatch(r'[a-zA-Z0-9_-]{1,128}', request_id) and key not in request_id:
                    event(directory, 'response', provider_request_id=request_id)
                ctype = response.headers.get('Content-Type', '').split(';')[0]
                require(ctype in ('audio/mpeg', 'audio/mp3', 'application/octet-stream'), 'Unexpected response format')
                # Keep partial bytes on interrupted streams, never resubmit automatically.
                partial = directory / 'response.partial'
                total = 0
                with partial.open('xb') as f:
                    while True:
                        chunk = response.read(65536)
                        if not chunk:
                            break
                        total += len(chunk)
                        require(total <= 32 * 1024 * 1024, 'Response too large')
                        f.write(chunk)
                        f.flush()
                        os.fsync(f.fileno())
                data = partial.read_bytes()
                info = mp3_info(data)
                require(info['sample_rate'] == 44100 and info['channels'] == 1,
                        'Response does not match requested sample rate/channel format')
                exclusive(directory / job['filename'], data)
                exclusive(directory / 'receipt.json', encoded(dict(media=info, qc='pending', listening_approved=False)))
                event(directory, 'complete-pending-QC')
                return info
        except urllib.error.HTTPError as exc:
            status = exc.code  # Never persist provider body/reason: it may contain secrets.
            exc.close()
            event(directory, 'ambiguous' if received_response else
                  'rate-limited' if status == 429 else 'failed' if 400 <= status < 500 else 'ambiguous',
                  http_status=status)
            if not received_response and status == 429 and attempt < retries:
                sleeper(min(2 ** (attempt + 1), 30))
                continue
            raise ProductionError(f'HTTP {status}; reservation retained, no automatic resubmission') from None
        except BaseException:
            event(directory, 'ambiguous')
            raise ProductionError('Generation interrupted/uncertain; inspect retained attempt before any new request') from None


def import_manual(job, stage, source, binding, decisions=DECISIONS):
    """Require operator-attested source evidence bound to bytes and frozen job identity."""
    require(job['availability'] == 'orderable', 'Order already present or attempted')
    data, b = Path(source).read_bytes(), read(binding)
    for key in ('recording_id', 'job_sha256', 'voice_uuid', 'generation_input'):
        require(b.get(key) == job[key], f'Import binding mismatch: {key}')
    require(b.get('sha256') == sha(data), 'Import SHA256 mismatch')
    rejected_hashes = {r['sha256'] for r in read(decisions)['recordings'].values()
                       if r['disposition'] == 'replace'}
    require(sha(data) not in rejected_hashes, 'Rejected historical audio bytes')
    for key in ('operator', 'source_reference', 'generated_at', 'model'):
        require(isinstance(b.get(key), str) and b[key].strip(), f'Missing import evidence: {key}')
    info = mp3_info(data)
    directory = reserve(stage, job, 'manual-web-import', {k: b[k] for k in (
        'operator', 'source_reference', 'generated_at', 'model', 'sha256')})
    exclusive(directory / job['filename'], data)
    exclusive(directory / 'receipt.json', encoded(dict(media=info, qc='pending', listening_approved=False)))
    event(directory, 'complete-pending-QC')
    return info


def verify_staged(jobs, stage):
    """Read-only content-bound QC handoff; reject stale jobs and tampered media/metadata."""
    known = {j['recording_id']: j for j in jobs}
    rows = []
    if not stage.exists():
        return rows
    for directory in sorted(stage.iterdir()):
        require(directory.is_dir() and not directory.is_symlink() and directory.name in known,
                'Unknown staging entry')
        j = known[directory.name]
        provenance = read(directory / 'provenance.json')
        require(provenance['job'] == j, f'Stale provenance: {directory.name}')
        require(provenance['qc'] == 'pending' and provenance['listening_approved'] is False, 'Invalid QC state')
        events = [read(p) for p in sorted(directory.glob('event-*.json'))]
        state = events[-1]['state'] if events else 'incomplete'
        row = dict(recording_id=directory.name, state=state, provenance=provenance,
                   listening_approved=False, qc='pending')
        if state == 'complete-pending-QC':
            p = directory / j['filename']
            require(p.is_file() and not p.is_symlink(), 'Missing or symlinked MP3')
            info = mp3_info(p.read_bytes())
            if provenance['kind'] == 'manual-web-import':
                require(provenance['details']['sha256'] == info['sha256'], 'Import evidence hash mismatch')
            require(read(directory / 'receipt.json') == dict(media=info, qc='pending', listening_approved=False),
                    f'Media/receipt mismatch: {directory.name}')
            row.update(media=info, path=str(p))
        rows.append(row)
    return rows


def report(jobs, summary):
    lines = ['# Fish production queue', '', 'No generation or listening approval implied.', '',
             '```json', json.dumps(summary, indent=2, sort_keys=True), '```', '',
             '| ID | Batch | Priority | Speaker | Fish UUID | Filename | Availability |',
             '| --- | --- | --- | --- | --- | --- | --- |']
    for j in jobs:
        lines.append('| ' + ' | '.join(str(j[k]) for k in ('recording_id', 'batch', 'priority',
            'speaker', 'voice_uuid', 'filename', 'availability')) + ' |')
    return '\n'.join(lines) + '\n'


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('operation', choices=('validate', 'plan', 'generate', 'import', 'verify'))
    parser.add_argument('--stage', type=Path, help='External staging root; explicitly required for writes')
    parser.add_argument('--inventory', action='append', default=[], type=Path)
    parser.add_argument('--batch', choices=('Q90', 'npc-069'))
    parser.add_argument('--priority', choices=('P0', 'P1', 'P2'))
    parser.add_argument('--speaker', help='Exact speaker key or Fish UUID')
    parser.add_argument('--recording-id', action='append', default=[])
    parser.add_argument('--json', action='store_true')
    parser.add_argument('--model', choices=MODELS)
    parser.add_argument('--execute', action='store_true', help='Explicit network opt-in; separate author authorization required')
    parser.add_argument('--bulk', action='store_true')
    parser.add_argument('--only-orderable', action='store_true', help='Explicitly skip all reserved/colliding jobs')
    parser.add_argument('--retries', type=int, choices=range(3), default=0, help='429 retries only (0–2)')
    parser.add_argument('--file', type=Path)
    parser.add_argument('--binding', type=Path)
    args = parser.parse_args(argv)
    try:
        jobs, summary = load_jobs()
        stage = safe_stage(args.stage or STAGE)
        require(not (args.execute or args.operation == 'import') or args.stage is not None,
                'Explicit persistent --stage required for production/import')
        summary['retained_reuse_hashes_verified'] = len(verify_reuse())
        # Verify provenance against canonical jobs before adding transient inventory state.
        if args.operation == 'verify':
            print(encoded(dict(recordings=verify_staged(jobs, stage))).decode(), end='')
            return 0
        availability(jobs, stage, args.inventory)
        selected = [j for j in jobs if (not args.batch or j['batch'] == args.batch)
                    and (not args.priority or j['priority'] == args.priority)
                    and (not args.speaker or args.speaker in (j['speaker'], j['voice_uuid']))
                    and (not args.recording_id or j['recording_id'] in args.recording_id)]
        require(set(args.recording_id) <= {j['recording_id'] for j in selected}, 'Unknown, excluded or conflicting recording ID filter')
        if args.only_orderable:
            summary['skipped_unavailable'] = [j['recording_id'] for j in selected if j['availability'] != 'orderable']
            selected = [j for j in selected if j['availability'] == 'orderable']
        require(selected, 'No eligible jobs match filters')
        summary['selected'] = len(selected)
        summary['availability'] = dict(sorted(Counter(j['availability'] for j in selected).items()))
        if args.operation in ('validate', 'plan'):
            print(encoded(dict(summary=summary, jobs=selected)).decode() if args.json else report(selected, summary), end='')
        elif args.operation == 'generate':
            require(args.model, 'Select --model explicitly, including for dry-run')
            require(not args.execute or args.bulk or (len(selected) == 1 and len(args.recording_id) == 1),
                    'Network requires one explicit --recording-id, or --bulk')
            for job in selected:
                # Check inventory again for each request; reservations prevent races between producers.
                availability([job], stage, args.inventory)
                canonical = {k: v for k, v in job.items() if k != 'availability'}
                if args.execute:
                    require(job['availability'] == 'orderable', f'Blocked order: {job["recording_id"]}')
                # Reserve canonical provenance; availability is not permanent identity.
                result = generate(job, stage, args.model, args.execute, args.retries)
                print(encoded(dict(recording_id=canonical['recording_id'], result=result)).decode(), end='')
        else:
            require(len(selected) == 1 and len(args.recording_id) == 1 and args.file and args.binding,
                    'Import requires one explicit ID, --file and --binding')
            print(encoded(import_manual(selected[0], stage, args.file, args.binding)).decode(), end='')
        return 0
    except ProductionError as exc:
        print(f'Production operation refused: {exc}', file=sys.stderr)
        return 1
    except (ValueError, OSError, KeyError, TypeError):
        # Never echo arbitrary exception strings, remote messages, paths or credentials.
        print('Production operation refused or failed. Check inputs, inventory and retained staging events; no automatic retry.', file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
