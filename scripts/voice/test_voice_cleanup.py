"""Validate approved removals against historical content and live runtime paths."""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import unittest

from voice_decisions import ROOT, load_decisions
from voice_assets import recording_path


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
                donor = recording_path(name)
                blob = subprocess.check_output(['git', 'hash-object', str(donor)], text=True).strip()
                self.assertEqual(blob, row['gitBlob'])
                if (ROOT/'public/sounds/voices'/name).exists():
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

    def test_author_identity_evidence_and_global_rejection_survive_migration(self):
        directory = ROOT/'docs/assets/voice-qc'
        registry = json.loads((directory/'author-decisions.json').read_text())
        historical = json.loads(subprocess.check_output([
            'git', 'show', '4646b07e:docs/assets/voice-qc/author-decisions.json',
        ], cwd=ROOT))
        audit = {r['file']: r for r in json.loads((directory/'identity-audit.json').read_text())['rows']}
        british = '82a3ef4504a6441e9a07acdaaf5349c1'
        self.assertEqual(registry['globalVoiceDecisions'][british]['decision'], 'rejected')
        self.assertEqual(len(registry['globalVoiceDecisions'][british]['recordings']), 8)
        for name, entry in registry['recordings'].items():
            self.assertEqual(entry['sha256'], audit[name]['sha256'])
            old = historical['recordings'][name]['speakerAssessment']
            self.assertEqual(entry['speakerAssessment']['authorCell'], old['authorCell'])
            self.assertEqual(entry['speakerAssessment']['ageMatchesFilename'], old['ageMatchesFilename'])
            if name in registry['globalVoiceDecisions'][british]['recordings']:
                self.assertEqual(entry['speakerAssessment']['confirmedSpeakerUuid'], british)
                self.assertEqual(entry['disposition'], 'replace')

    def test_active_tool_paths_and_catalog_coverage(self):
        old_location = 'docs/' + 'v3-donor/voices/'
        for path in (ROOT/'scripts/voice').glob('*'):
            if path.suffix in ('.py', '.json'):
                self.assertNotIn(old_location, path.read_text(), str(path))
        catalog = (ROOT/'docs/design/npc-voices/CATALOG.md').read_text()
        registry = json.loads((ROOT/'docs/assets/voice-qc/author-decisions.json').read_text())
        for name in registry['recordings']:
            self.assertIn(name, catalog)
        self.assertFalse(any(p.is_file() for p in (ROOT/'docs/v3-donor/voices').rglob('*')))
        for name in ['2026-11-05--named-npc-voice-script.json', '2026-11-04--q90-fish-audio-script.json']:
            path = ROOT/'docs/research/v1-revival'/name
            self.assertNotIn(old_location, path.read_text())
            original = json.loads(subprocess.check_output([
                'git', 'show', '4646b07e:' + str(path.relative_to(ROOT)),
            ], cwd=ROOT))
            current = json.loads(path.read_text())
            def without_migrated_paths(value):
                if isinstance(value, dict):
                    return {k: without_migrated_paths(v) for k, v in value.items()
                            if k not in ('source_file', 'casting_authority')}
                if isinstance(value, list):
                    return [without_migrated_paths(v) for v in value]
                return value
            self.assertEqual(without_migrated_paths(current), without_migrated_paths(original))
            for source in re.findall(r'"source_file": "([^"]+\.mp3)"', path.read_text()):
                self.assertTrue((ROOT/source).is_file(), source)


    def test_regeneration_manifest_covers_removals_and_preserves_source_text(self):
        directory = ROOT/'docs/assets/voice-qc'
        backlog = json.loads((directory/'regeneration-backlog.json').read_text())['recordings']
        removals = {r['filename']: r for r in json.loads((directory/'deletion-manifest.json').read_text())['recordings']}
        ledger = {r['file']: r for r in json.loads((directory/'ledger.json').read_text())['rows']}
        self.assertEqual({r['originalFilename'] for r in backlog}, set(removals))
        self.assertEqual(sum(r['runtimeCritical'] for r in backlog), 7)
        for row in backlog:
            name = row['originalFilename']
            self.assertEqual(row['originalSha256'], removals[name]['sha256'])
            self.assertEqual(row['originalCatalogText'], ledger[name]['catalogText'])
            self.assertEqual(row['verifiedAsrText'], ledger[name]['asrText'])
            self.assertEqual(row['targetLocation'], 'public/sounds/voices/' + name)
            self.assertNotEqual(row['expectedReplacementSpeakerUuid'], '82a3ef4504a6441e9a07acdaaf5349c1')

    def test_migration_preserves_every_retained_hash(self):
        directory = ROOT/'docs/assets/voice-qc'
        inventory = json.loads((directory/'migration-inventory.json').read_text())['recordings']
        removed = {r['sha256'] for r in json.loads((directory/'deletion-manifest.json').read_text())['recordings']}
        for row in inventory:
            if row['finalPath'] is None:
                self.assertIn(row['sha256'], removed)
                continue
            target = ROOT/row['finalPath']
            self.assertTrue(target.is_file(), row['finalPath'])
            self.assertEqual(hashlib.sha256(target.read_bytes()).hexdigest(), row['sha256'])
        playable = list((ROOT/'public/sounds/voices').glob('*.mp3'))
        self.assertEqual(len(playable), 265)
        self.assertFalse(any(p.name.startswith('general_male_b_') for p in playable))
        self.assertFalse(removed & {hashlib.sha256(p.read_bytes()).hexdigest() for p in playable})
        # Each retained physical audio content has exactly one copy; reference aliases are symlinks.
        paths = playable + list((ROOT/'docs/archive/voice-donor').rglob('*.mp3'))
        physical = [p for p in paths if not p.is_symlink()]
        self.assertEqual(len(physical), len({hashlib.sha256(p.read_bytes()).hexdigest() for p in physical}))

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
