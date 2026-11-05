"""Validate approved removals against historical content and live runtime paths."""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import unittest

from voice_decisions import ROOT, load_decisions


class CleanupTests(unittest.TestCase):
    def test_history_and_exact_removal_inventory(self):
        directory = ROOT/'docs/assets/voice-qc'
        decisions = json.loads((directory/'author-decisions.json').read_text())
        ledger = json.loads((directory/'ledger.json').read_text())
        historical = subprocess.check_output([
            'git', 'show', decisions['historicalCommit']+':docs/assets/voice-qc/ledger.json',
        ], cwd=ROOT)
        self.assertEqual(ledger, json.loads(historical))
        self.assertEqual(len(ledger['rows']), 317)
        entries = load_decisions(ledger['rows'])
        manifest = json.loads((directory/'deletion-manifest.json').read_text())['recordings']
        removed = {r['filename']: r for r in manifest}
        self.assertEqual(len(manifest), 14)
        self.assertEqual(set(removed), {n for n, e in entries.items() if e['disposition'] == 'replace'})
        paths = subprocess.check_output(['git', 'ls-files', '-z', '*.mp3'], cwd=ROOT).decode().split('\0')[:-1]
        existing = {p: hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in paths if (ROOT/p).exists()}
        for row in ledger['rows']:
            name = row['file']
            if name not in removed:
                donor = ROOT/'docs/v3-donor/voices/mp3'/name
                blob = subprocess.check_output(['git', 'hash-object', str(donor)], text=True).strip()
                self.assertEqual(blob, row['gitBlob'])
                if row['inV1Public']:
                    self.assertEqual((ROOT/'public/sounds/voices'/name).read_bytes(), donor.read_bytes())
                continue
            removal = removed[name]
            self.assertEqual(removal['gitBlob'], row['gitBlob'])
            self.assertEqual(len(removal['paths']), 2)
            self.assertNotIn(removal['sha256'], existing.values())
            for path in removal['paths']:
                self.assertFalse((ROOT/path).exists())
                audio = subprocess.check_output(['git', 'show', removal['recoveryCommit']+':'+path], cwd=ROOT)
                self.assertEqual(hashlib.sha256(audio).hexdigest(), removal['sha256'])

    def test_all_static_runtime_voice_urls_exist(self):
        checked = set()
        for path in (ROOT/'src').rglob('*.ts'):
            if path.name.endswith('.test.ts'):
                continue
            for url in re.findall(r'(?:/sounds/voices|\$\{VOICES\})/[\w/.-]+\.mp3', path.read_text()):
                url = url.replace('${VOICES}', '/sounds/voices')
                self.assertTrue((ROOT/'public'/url.lstrip('/')).is_file(), f'{path}: {url}')
                checked.add(url)
        self.assertGreater(len(checked), 50)


if __name__ == '__main__':
    unittest.main()
