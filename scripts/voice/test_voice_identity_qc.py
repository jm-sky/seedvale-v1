import importlib.util
import json
from pathlib import Path
import tempfile
import subprocess
import sys
import unittest
from voice_decisions import load_decisions, retain_removed_rows
from voice_assets import evidence_path

spec = importlib.util.spec_from_file_location('identity', Path(__file__).with_name('voice-identity-qc.py'))
qc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(qc)

class IdentityTests(unittest.TestCase):
    def test_structured_dispositions_survive_fresh_report_and_category_move(self):
        ledger = json.loads((qc.ROOT/'docs/assets/voice-qc/ledger.json').read_text())['rows']
        entries = load_decisions(ledger)
        self.assertEqual(sum(e['disposition'] == 'keep' for e in entries.values()), 7)
        self.assertEqual(sum(e['disposition'] == 'replace' for e in entries.values()), 14)
        audit = json.loads((qc.ROOT/'docs/assets/voice-qc/identity-audit.json').read_text())
        for row in audit['rows']:
            if row['classification'] == 'suspected-wrong-speaker':
                self.assertEqual(entries[row['file']]['disposition'], 'replace')
            row['classification'] = 'ambiguous'
        with tempfile.TemporaryDirectory() as tmp:
            source, output = Path(tmp)/'audit.json', Path(tmp)/'report.md'
            source.write_text(json.dumps(audit))
            command = [sys.executable, str(Path(__file__).with_name('voice-identity-report.py')), str(source), str(output)]
            subprocess.run(command, check=True)
            first = output.read_text()
            for name, entry in entries.items():
                line = next(line for line in first.splitlines() if line.startswith(f'| {name} |'))
                self.assertTrue(line.endswith(f"| {entry['speakerAssessment']['authorCell']} | {entry['disposition']} |"))
            subprocess.run(command, check=True)
            self.assertEqual(first, output.read_text())
            output.write_text(first.replace('| REMOVE | replace |', '| keep | replace |', 1))
            before = output.read_text()
            self.assertNotEqual(subprocess.run(command, capture_output=True).returncode, 0)
            self.assertEqual(before, output.read_text())
        stale = [dict(r) for r in ledger]
        stale[0]['gitBlob'] = 'changed'
        with self.assertRaisesRegex(ValueError, 'Stale'):
            load_decisions(stale)

    def test_ledger_retains_only_authorized_removed_history(self):
        rows = json.loads((qc.ROOT/'docs/assets/voice-qc/ledger.json').read_text())['rows']
        entries = load_decisions(rows)
        current = [r for r in rows if entries[r['file']]['disposition'] != 'replace']
        previous = {r['file']: r for r in rows}
        self.assertEqual(retain_removed_rows(previous, current, entries), rows)
        with self.assertRaisesRegex(ValueError, 'Unapproved missing audio'):
            retain_removed_rows(previous, current[1:], entries)

    def test_expected_overrides_and_unknowns(self):
        mapping = json.loads(Path(__file__).with_name('voice-identity-map.json').read_text())
        overrides = json.loads(Path(__file__).with_name('voice-identity-overrides.json').read_text())
        ledger = json.loads((qc.ROOT/'docs/assets/voice-qc/ledger.json').read_text())['rows']
        rows = {r['file']:r for r in ledger}
        for file, entry in overrides['recordings'].items():
            self.assertEqual(qc.expected_uuid(rows[file], mapping, overrides), entry['uuid'])
        self.assertEqual(qc.expected_uuid(rows['general_male_young_greeting_02.mp3'], mapping, overrides), mapping['voices']['Little-Lem'])
        self.assertIsNone(qc.expected_uuid(rows['general_male_young_greeting_01.mp3'], mapping, overrides))
        self.assertIsNone(qc.expected_uuid({'voiceId':'unknown'}, mapping, overrides))
        self.assertIsNone(qc.expected_uuid({'voiceId':'KID'}, mapping, overrides))
        self.assertEqual(qc.expected_uuid({'voiceId':mapping['voices']['Laura']}, mapping, overrides), mapping['voices']['Laura'])
        stale = dict(rows['general_female_old_farewell_01.mp3'], gitBlob='changed')
        with self.assertRaisesRegex(ValueError, 'Stale'):
            qc.expected_uuid(stale, mapping, overrides)
        for entry in overrides['recordings'].values():
            for evidence in entry['evidence']:
                if evidence.endswith('.mp3'):
                    self.assertEqual(subprocess.check_output(['git', 'hash-object', str(evidence_path(evidence))], text=True).strip(), entry['gitBlob'])

    def test_report_preserves_decisions_across_classification_changes(self):
        report_spec = importlib.util.spec_from_file_location('report', Path(__file__).with_name('voice-identity-report.py'))
        renderer = importlib.util.module_from_spec(report_spec)
        report_spec.loader.exec_module(renderer)
        audit = qc.ROOT/'docs/assets/voice-qc/identity-audit.json'
        with tempfile.TemporaryDirectory() as tmp:
            output = Path(tmp)/'audit.md'
            source = '| File | Decision |\n| --- | --- |\n'
            decisions = {'general_male_young_greeting_02.mp3':'Little-Lem', 'general_female_old_farewell_01.mp3':'Old-woman', 'general_male_greeting_01.mp3':'REMOVE', 'general_male_danger_alert_01.mp3':'guard?'}
            output.write_text(source + ''.join(f'| {f} | {v} |\n' for f,v in decisions.items()))
            command = [sys.executable, str(Path(__file__).with_name('voice-identity-report.py')), str(audit), str(output)]
            subprocess.run(command, check=True)
            first = output.read_text()
            parsed = renderer.read_decisions(first)
            self.assertTrue(all(parsed[f] == v for f,v in decisions.items()))
            subprocess.run(command, check=True)
            self.assertEqual(first, output.read_text())
            output.write_text(source + '| unknown.mp3 | KEEP |\n')
            before = output.read_text()
            result = subprocess.run(command, capture_output=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(output.read_text(), before)
        with self.assertRaises(ValueError):
            renderer.read_decisions(source + '| a.mp3 | extra | KEEP |')

    def test_mapping(self):
        mapping = json.loads(Path(__file__).with_name('voice-identity-map.json').read_text())
        self.assertEqual(qc.expected_uuid({'voiceId':'general_male_b'},mapping),mapping['voices']['Brian-British'])
        self.assertIsNone(mapping['voices']['KID'])
        self.assertEqual(qc.reference_name(Path('Laura-2026-10-20-test.mp3')),'Laura')
        self.assertEqual(len(mapping['modelRevision']),40)

    def test_content_cache_and_version(self):
        calls=[]
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); a=root/'a'; b=root/'b';a.write_bytes(b'audio');b.write_bytes(b'audio')
            def extract(path):
                calls.append(path)
                return {'embedding':[3,4], 'durationSec':1}
            cache=qc.Cache(root/'cache','version1',extract)
            self.assertEqual(cache.get(a),cache.get(b))
            self.assertEqual(len(calls),1)
            qc.Cache(root/'cache','version2',extract).get(b)
            self.assertEqual(len(calls),2)

    def test_duplicate_exclusion_and_output(self):
        refs=[dict(file='self',sha256='same',uuid='a',embedding=[1,0]),
              dict(file='other',sha256='other',uuid='b',embedding=[0,1])]
        result=qc.compare('same',[1,0],refs,'a')
        self.assertEqual(result['excludedIdentical'],['self'])
        self.assertTrue(result['missingExpectedReference'])
        self.assertIsNone(result['expectedScore'])
        self.assertEqual(result['bestUuid'],'b')
        self.assertEqual(result['bestScore'],0)
        self.assertIsNone(result['margin'])
        json.dumps(result,allow_nan=False)

    def test_classification_stays_conservative(self):
        policy={'minScore':.45,'minMargin':.15}
        row=dict(missingExpectedReference=False,bestScore=.6,margin=.2,bestUuid='a',expectedUuid='a')
        self.assertEqual(qc.classify(row,policy),'strong-match')
        row['expectedUuid']='b'
        self.assertEqual(qc.classify(row,policy),'suspected-wrong-speaker')
        row['margin']=.01
        self.assertEqual(qc.classify(row,policy),'ambiguous')
        row['missingExpectedReference']=True
        self.assertEqual(qc.classify(row,policy),'missing-reference')
        row['expectedUuid']=None
        self.assertEqual(qc.classify(row,policy),'unresolved-expected')

    def test_committed_audit_integrity(self):
        path=qc.ROOT/'docs/assets/voice-qc/identity-audit.json'
        if not path.exists():
            self.skipTest('Full audit has not been run')
        audit=json.loads(path.read_text())
        ledger=json.loads((qc.ROOT/'docs/assets/voice-qc/ledger.json').read_text())
        self.assertEqual({r['file'] for r in audit['rows']},{r['file'] for r in ledger['rows']})
        self.assertEqual(len(audit['rows']),len(ledger['rows']))
        refs={r['file']:r for r in audit['references']}
        mapping=json.loads(Path(__file__).with_name('voice-identity-map.json').read_text())
        overrides_path=qc.ROOT/'docs/archive/voice-donor/qc-config-2026-11-05/voice-identity-overrides.json'
        overrides=json.loads(overrides_path.read_text())
        self.assertEqual(audit['overridesSha256'], qc.digest(overrides_path))
        ledger_rows={r['file']:r for r in ledger['rows']}
        for row in audit['rows']:
            self.assertNotIn('error',row)
            original=ledger_rows[row['file']]
            self.assertEqual(row['ledgerVoiceId'],original['voiceId'])
            self.assertEqual(row['expectedUuid'],qc.expected_uuid(original,mapping,overrides))
            self.assertEqual(row['expectedScore'],row['voiceScores'].get(row['expectedUuid']))
            self.assertEqual(row['bestScore'],max(row['voiceScores'].values()))
            for pair in row['pairs']:
                self.assertNotEqual(row['sha256'],refs[pair['file']]['sha256'])
            self.assertEqual(row['classification'],qc.classify(row,audit['policy']))

    def test_pooling_margin(self):
        refs=[dict(file=str(i),sha256=str(i),uuid=u,embedding=e) for i,(u,e) in enumerate([('a',[1,0]),('a',[0,1]),('b',[0,1])])]
        result=qc.compare('target',[1,0],refs,'a')
        self.assertEqual(result['expectedScore'],.5)
        self.assertEqual(result['margin'],.5)
        self.assertEqual(len(result['pairs']),3)

if __name__=='__main__':
    unittest.main()
