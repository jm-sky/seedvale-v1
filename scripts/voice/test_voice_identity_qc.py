import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('identity', Path(__file__).with_name('voice-identity-qc.py'))
qc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(qc)

class IdentityTests(unittest.TestCase):
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

    def test_committed_audit_integrity(self):
        path=qc.ROOT/'docs/assets/voice-qc/identity-audit.json'
        if not path.exists():
            self.skipTest('Full audit has not been run')
        audit=json.loads(path.read_text())
        ledger=json.loads((qc.ROOT/'docs/assets/voice-qc/ledger.json').read_text())
        self.assertEqual({r['file'] for r in audit['rows']},{r['file'] for r in ledger['rows']})
        self.assertEqual(len(audit['rows']),len(ledger['rows']))
        refs={r['file']:r for r in audit['references']}
        for row in audit['rows']:
            self.assertNotIn('error',row)
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
