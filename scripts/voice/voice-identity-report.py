#!/usr/bin/env python3
"""Render review priorities from an identity audit; never modifies its input."""
import argparse
from collections import Counter
import json
from pathlib import Path
from voice_decisions import load_decisions
from voice_assets import evidence_path


def read_decisions(text):
    """Read author cells by filename; reject malformed tables rather than lose edits."""
    decisions = {}
    headers = []
    for line in text.splitlines():
        if not line.startswith('|'):
            headers = []
            continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if cells[0] == 'File':
            headers = cells
        elif 'Decision' in headers and '.mp3' in cells[0]:
            if len(cells) != len(headers) or cells[0] in decisions:
                raise ValueError('Malformed or duplicate author decision row')
            decisions[cells[0]] = cells[headers.index('Decision')]
    return decisions


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('audit', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    report = json.loads(args.audit.read_text())
    dispositions = load_decisions(report['rows'])
    decisions = read_decisions(args.output.read_text()) if args.output.exists() else {}
    if set(decisions) - {r['file'] for r in report['rows']}:
        raise ValueError('Regeneration would drop author decision rows')
    for name, entry in dispositions.items():
        cell = entry['speakerAssessment']['authorCell']
        if name in decisions and decisions[name] != cell:
            raise ValueError(f'Author cell differs from structured decisions: {name}')
        decisions[name] = cell
    mapping = json.loads(Path(__file__).with_name('voice-identity-map.json').read_text())
    names = {v:k for k,v in mapping['voices'].items() if v}
    counts = Counter(r.get('classification','analysis-error') for r in report['rows'])
    lines = ['# NPC speaker identity audit — 2026-11-05', '',
             'Identity evidence only: no transcript-QC or author verdict is changed. Similarity is not definitive proof of identity. Do not delete or admit MP3s based on this report.', '',
             '[Calibration and limits](IDENTITY-CALIBRATION.md) · [Raw scores and provenance](identity-audit.json) · [Setup](../../../scripts/voice/IDENTITY-QC.md)', '',
             f"Analyzed {len(report['rows'])} ledger rows / {report['uniqueTargetContents']} distinct audio hashes. Identical public copies verified: {sum(r.get('publicCopyIdentical') is True for r in report['rows'])}. No redundant public embedding extraction.", '',
             f"Measured: {report['wallSec']:.2f}s wall; {report['cpuUserSec']+report['cpuSystemSec']:.2f}s CPU (user {report['cpuUserSec']:.2f}s, system {report['cpuSystemSec']:.2f}s); peak RSS {report['peakRssKiB']/1024:.1f} MiB; {report['threads']} CPU threads. Cache: {report['cacheHits']} hits / {report['cacheMisses']} extractions. Model initialized: {report.get('modelInitialized', True)}.", '',
             '[Expected mapping corrections, evidence and before/after comparison](IDENTITY-MAPPING-REVIEW.md). Null Expected means unresolved identity, not the best scoring candidate. Ledger voiceId is retained in JSON. [Structured author decisions](author-decisions.json) own the separate Disposition and speaker Decision cells; conflicting Markdown edits stop regeneration. Neither changes identity classifications or transcript QC. This is historical audio evidence, including removed recordings; see the [replacement backlog](regeneration-backlog.json).', '',
             '| Classification | Count |', '| --- | ---: |']
    lines += [f'| {key} | {value} |' for key,value in sorted(counts.items())]
    lines += ['', 'Review suspected wrong-speaker cases first, then ambiguous clips. Strong matches still require source/context/listening QC before cleanup. Single-reference voices and short or expressive clips have weaker evidence; absent speakers can never be identified by a closed reference set.', '',
              '## Reference coverage and errors', '']
    for error in report['referenceErrors']:
        lines.append(f"- `{evidence_path(error['file']).relative_to(Path(__file__).resolve().parents[2])}`: {error['error']}")
    single = Counter(r['uuid'] for r in report['references'])
    lines += ['', 'Single-reference voices: '+', '.join(names[k] for k,v in single.items() if v==1)+'. These lack independent within-speaker reference validation.', '']
    for kind in ['suspected-wrong-speaker','unresolved-expected','ambiguous','missing-reference','analysis-error','strong-match']:
        lines += ['## '+kind, '', '| File | Expected | Best reference | Best | Expected score | Margin | Decision | Disposition |', '| --- | --- | --- | ---: | ---: | ---: | --- | --- |']
        rows = [r for r in report['rows'] if r.get('classification','analysis-error')==kind]
        for row in sorted(rows,key=lambda r:-(r.get('margin') or 0)):
            def num(key):
                value=row.get(key)
                return f'{value:.3f}' if value is not None else '—'
            lines.append(f"| {row['file']} | {names.get(row['expectedUuid'],row['expectedUuid']) or 'unresolved'} | {names.get(row.get('bestUuid'),row.get('error','—'))} | {num('bestScore')} | {num('expectedScore')} | {num('margin')} | {decisions[row['file']]} | {dispositions[row['file']]['disposition']} |")
        lines.append('')
    args.output.write_text('\n'.join(lines)+'\n')

if __name__=='__main__':
    main()
