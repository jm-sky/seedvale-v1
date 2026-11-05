"""Resolve retained historical recordings without treating storage as runtime admission."""
import json
from voice_decisions import ROOT

PUBLIC = ROOT / 'public/sounds/voices'
ARCHIVE = ROOT / 'docs/archive/voice-donor'
INVENTORY = ROOT / 'docs/assets/voice-qc/migration-inventory.json'


def recording_path(filename):
    """Find the content-preserving destination recorded by the donor migration."""
    inventory = json.loads(INVENTORY.read_text())['recordings']
    paths = {r['finalPath'] for r in inventory if r['filename'] == filename and r['finalPath']
             and r['origin'] == 'historical donor bank / V1 copy'}
    if not paths:
        raise FileNotFoundError(f'No retained recording: {filename}')
    # Public duplicates converge on the same canonical path; named references are separate names.
    if len(paths) != 1:
        raise ValueError(f'Ambiguous migrated filename: {filename}')
    return ROOT / paths.pop()


def evidence_path(path):
    """Resolve original provenance paths through the immutable migration inventory."""
    for row in json.loads(INVENTORY.read_text())['recordings']:
        if row['path'] == path and row['finalPath']:
            return ROOT / row['finalPath']
    return ROOT / path
