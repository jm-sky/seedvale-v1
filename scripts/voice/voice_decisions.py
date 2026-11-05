"""Content-bound author recording dispositions, independent of speaker/transcript QC."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DECISIONS = ROOT / 'docs/assets/voice-qc/author-decisions.json'


def load_decisions(rows, path=DECISIONS):
    """Reject stale or incomplete author evidence before generating any output."""
    entries = json.loads(path.read_text())['recordings']
    if set(entries) != {r['file'] for r in rows}:
        raise ValueError('Author decisions must cover exactly the historical ledger filenames')
    for row in rows:
        entry = entries[row['file']]
        if entry['gitBlob'] != row.get('gitBlob', row.get('ledgerGitBlob')):
            raise ValueError(f"Stale author disposition: {row['file']}")
        if entry['disposition'] not in ('keep', 'replace', 'pending'):
            raise ValueError(f"Invalid author disposition: {row['file']}")
    return entries


def retain_removed_rows(previous, current, decisions):
    """Retain approved removals verbatim; fail on unexplained inventory loss."""
    present = {r['file'] for r in current}
    retained = []
    for name, row in previous.items():
        if name not in present:
            if decisions[name]['disposition'] != 'replace':
                raise ValueError(f'Unapproved missing audio: {name}')
            retained.append(row)
    return sorted(current + retained, key=lambda r: r['file'])
