"""Offline production safety tests: synthetic manifests/media and mocked REST streams."""
import copy
import contextlib
import io
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import Mock, patch
import urllib.error

import voice_production as v


def media():
    # MPEG1 Layer III, 128kbps/44100Hz mono, two complete synthetic frames.
    # Frame structure fixture only; deliberately not evidence of audible quality.
    return (bytes.fromhex('fffb90c0') + bytes(413)) * 2


class Response(io.BytesIO):
    headers = {'Content-Type': 'audio/mpeg', 'x-request-id': 'test-request-001'}


class ProductionTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.stage = self.base / 'stage'
        real_q, real_n = v.read(v.Q90), v.read(v.NPC69)
        self.q = copy.deepcopy(real_q)
        self.q['recordings'] = self.q['recordings'][:1]
        self.n = copy.deepcopy(real_n)
        row = next(r for r in self.n['records'] if r['status'] == 'ready-to-order' and r['characterKey'])
        alias = copy.deepcopy(next(r for r in real_n['records'] if r['status'] == 'Q90-already-ordered'))
        owner = self.q['recordings'][0]
        alias.update(recording_id=owner['id'], fish_voice_uuid=owner['fish_voice_id'],
                     suggested_filename=owner['filename'], generation_input=owner['generation_input'],
                     canonical_transcript=owner['canonical_transcript'])
        self.n['records'] = [row, alias] + [copy.deepcopy(next(r for r in real_n['records'] if r['status'] == status))
            for status in ('reuse-QC-pending', 'binding-held', 'restoration-held', 'deferred-optional')]
        self.qp, self.np = self.base / 'q.json', self.base / 'n.json'
        self.jobs = self.load()[0]
        v.availability(self.jobs, self.stage)
        self.job = self.jobs[0]
        self.env = patch.dict(os.environ, {'FISH_API_KEY': 'secret-test-key'})
        self.env.start()
        self.addCleanup(self.env.stop)

    def load(self):
        self.qp.write_bytes(v.encoded(self.q))
        self.np.write_bytes(v.encoded(self.n))
        return v.load_jobs(self.qp, self.np)

    def binding(self, data=None):
        data = media() if data is None else data
        source, binding = self.base / 'random-download.mp3', self.base / 'binding.json'
        source.write_bytes(data)
        b = {k: self.job[k] for k in ('recording_id', 'job_sha256', 'voice_uuid', 'generation_input')}
        b.update(sha256=v.sha(data), operator='test-operator', source_reference='fish-web-project-123',
                 generated_at='2026-11-06', model='operator-recorded-model')
        binding.write_bytes(v.encoded(b))
        return source, binding

    def execute(self, transport, **kwargs):
        return v.generate(self.job, self.stage, 's2.1-pro', execute=True, transport=transport, **kwargs)

    def test_real_counts_statuses_and_hashes(self):
        jobs, s = v.load_jobs()
        self.assertEqual((s['Q90_orders'], s['unique_orders']), (87, 159))
        self.assertEqual(s['npc069_statuses'], {'ready-to-order': 72, 'reuse-QC-pending': 33,
            'Q90-already-ordered': 12, 'binding-held': 3, 'restoration-held': 5, 'deferred-optional': 7})
        self.assertEqual(len(v.verify_reuse()), 33)
        self.assertEqual(sum(len(j['aliases']) for j in jobs), 12)
        v.availability(jobs, self.stage)
        self.assertTrue(all(j['availability'] == 'orderable' for j in jobs))

    def test_aliases_and_exclusions(self):
        jobs, _ = self.load()
        self.assertEqual(len(jobs), 2)
        self.assertEqual(sum(len(j['aliases']) for j in jobs), 1)
        self.assertEqual({j['original']['status'] for j in jobs}, {v.QSTATUS, 'ready-to-order'})

    def test_exact_input_cast_and_context(self):
        for j in self.jobs:
            body = v.request_body(j)
            self.assertEqual(body['text'], j['original']['generation_input'])
            self.assertEqual(j['canonical_transcript'], j['original']['canonical_transcript'])
            self.assertEqual(body['reference_id'], j['voice_uuid'])
            self.assertIn(j['original'], self.q['recordings'] + self.n['records'])
        self.n['records'][0]['generation_input'] = '  Exact fixture input!\n'
        jobs, _ = self.load()
        self.assertIn('  Exact fixture input!\n', [j['generation_input'] for j in jobs])

    def test_rejected_uuid_even_with_matching_profile(self):
        for uuid in v.read(v.DECISIONS)['globalVoiceDecisions']:
            with self.subTest(uuid=uuid):
                self.q['recordings'][0]['fish_voice_id'] = uuid
                self.q['profiles'][self.q['recordings'][0]['speaker']]['fish_voice_id'] = uuid
                with self.assertRaisesRegex(ValueError, 'Rejected speaker'):
                    self.load()

    def test_cast_mismatch(self):
        self.n['records'][0]['fish_voice_uuid'] = 'a' * 32
        with self.assertRaisesRegex(ValueError, 'casting mismatch'):
            self.load()

    def test_alias_drift_and_missing_owner(self):
        self.n['records'][1]['generation_input'] += '!'
        with self.assertRaisesRegex(ValueError, 'alias differs'):
            self.load()
        self.n['records'][1]['recording_id'] = 'Q90-999'
        with self.assertRaisesRegex(ValueError, 'Unresolved Q90'):
            self.load()

    def test_invalid_status_filename_id_text(self):
        original = copy.deepcopy(self.n)
        for field, value in [('status', 'approved'), ('disposition', 'reuse'), ('recording_id', '../oops'),
                              ('suggested_filename', '../oops.mp3'), ('generation_input', ''),
                              ('fish_voice_uuid', 'bad'), ('context_predicates', [])]:
            with self.subTest(field=field):
                self.n = copy.deepcopy(original)
                self.n['records'][0][field] = value
                with self.assertRaises(ValueError):
                    self.load()

    def test_duplicate_id_filename_input(self):
        original = copy.deepcopy(self.n['records'][0])
        for kind in ('id', 'filename', 'input'):
            other = copy.deepcopy(original)
            if kind != 'id':
                other['recording_id'] = 'NV-999'
            if kind == 'input':
                other['suggested_filename'] = 'unique.mp3'
            self.n['records'].append(other)
            with self.assertRaisesRegex(ValueError, 'Duplicate'):
                self.load()
            self.n['records'].pop()

    def test_no_network_or_writes_during_dry_run(self):
        transport = Mock(side_effect=AssertionError('network forbidden'))
        with patch.dict(os.environ, {}, clear=True):
            result = v.generate(self.job, self.stage, 's2.1-pro', transport=transport)
        self.assertTrue(result['dry_run'])
        transport.assert_not_called()
        self.assertFalse(self.stage.exists())

    def test_success_provenance_and_rerun_block(self):
        transport = Mock(return_value=Response(media()))
        self.execute(transport)
        canonical, _ = self.load()
        handoff = v.verify_staged(canonical, self.stage)
        self.assertEqual(handoff[0]['qc'], 'pending')
        self.assertFalse(handoff[0]['listening_approved'])
        stored = ''.join(p.read_text() for p in self.stage.rglob('*.json'))
        self.assertNotIn('secret-test-key', stored)
        before = {p: p.read_bytes() for p in self.stage.rglob('*') if p.is_file()}
        with self.assertRaises(FileExistsError):
            self.execute(transport)
        self.assertEqual(transport.call_count, 1)
        self.assertEqual(before, {p: p.read_bytes() for p in self.stage.rglob('*') if p.is_file()})

    def test_inventory_collision_and_cross_directory_mp3(self):
        inventory = self.base / 'deliveries'
        inventory.mkdir()
        (inventory / self.job['filename']).write_bytes(media())
        v.availability(self.jobs, self.stage, [inventory])
        self.assertEqual(self.job['availability'], 'inventory-collision')
        with self.assertRaises(ValueError):
            self.execute(Mock())

    def test_partial_reservation_blocks_rerun(self):
        (self.stage / self.job['recording_id']).mkdir(parents=True)
        v.availability(self.jobs, self.stage)
        self.assertEqual(self.job['availability'], 'staged-or-attempted')
        transport = Mock()
        with self.assertRaises(ValueError):
            self.execute(transport)
        transport.assert_not_called()

    def test_http_failures_never_blindly_retry(self):
        for code, state in [(401, 'failed'), (402, 'failed'), (429, 'rate-limited'), (503, 'ambiguous'), (302, 'ambiguous')]:
            with self.subTest(code=code), tempfile.TemporaryDirectory() as d:
                transport = Mock(side_effect=urllib.error.HTTPError('url', code, 'secret-test-key', {}, None))
                with self.assertRaises(ValueError):
                    v.generate(self.job, Path(d), 's2.1-pro', True, 0, transport)
                events = [v.read(p) for p in sorted(Path(d).rglob('event-*.json'))]
                self.assertEqual(events[-1]['state'], state)
                transport.assert_called_once()

    def test_explicit_429_backoff(self):
        transport = Mock(side_effect=[urllib.error.HTTPError('url', 429, 'rate', {}, None), Response(media())])
        sleeper = Mock()
        self.execute(transport, retries=1, sleeper=sleeper)
        sleeper.assert_called_once_with(2)
        self.assertEqual(transport.call_count, 2)

    def test_timeouts_interrupts_invalid_audio_are_ambiguous(self):
        for failure in (TimeoutError(), KeyboardInterrupt(), Response(b'bad audio')):
            with self.subTest(failure=type(failure).__name__), tempfile.TemporaryDirectory() as d:
                transport = Mock(side_effect=failure) if isinstance(failure, BaseException) else Mock(return_value=failure)
                with self.assertRaises(ValueError):
                    v.generate(self.job, Path(d), 's2.1-pro', True, 2, transport)
                events = [v.read(p) for p in sorted(Path(d).rglob('event-*.json'))]
                self.assertEqual(events[-1]['state'], 'ambiguous')
                transport.assert_called_once()

    def test_interrupted_response_preserves_partial_bytes(self):
        response = Mock()
        response.__enter__ = Mock(return_value=response)
        response.__exit__ = Mock(return_value=False)
        response.headers = Response.headers
        response.read.side_effect = [media()[:100], TimeoutError()]
        with self.assertRaises(ValueError):
            self.execute(Mock(return_value=response))
        self.assertEqual(next(self.stage.rglob('response.partial')).read_bytes(), media()[:100])
        self.assertEqual(list(self.stage.rglob('*.mp3')), [])

    def test_manual_import_binding_and_hash(self):
        source, binding = self.binding()
        v.import_manual(self.job, self.stage, source, binding)
        self.assertEqual(source.read_bytes(), media())
        handoff = v.verify_staged(self.load()[0], self.stage)
        self.assertEqual(handoff[0]['media']['sha256'], v.sha(media()))
        self.assertEqual(handoff[0]['provenance']['kind'], 'manual-web-import')
        with self.assertRaises(FileExistsError):
            v.import_manual(self.job, self.stage, source, binding)

    def test_manual_import_rejects_missing_wrong_evidence(self):
        source, binding = self.binding()
        original = v.read(binding)
        for field in ('recording_id', 'job_sha256', 'voice_uuid', 'generation_input', 'sha256', 'operator', 'source_reference', 'model'):
            b = dict(original)
            b[field] = ''
            binding.write_bytes(v.encoded(b))
            with self.subTest(field=field), self.assertRaises(ValueError):
                v.import_manual(self.job, self.stage, source, binding)
        self.assertFalse(self.stage.exists())

    def test_rejected_bytes_cannot_be_imported(self):
        source, binding = self.binding()
        decisions = self.base / 'decisions.json'
        decisions.write_bytes(v.encoded({'recordings': {'old': {'disposition': 'replace', 'sha256': v.sha(media())}}}))
        with self.assertRaisesRegex(ValueError, 'Rejected historical'):
            v.import_manual(self.job, self.stage, source, binding, decisions)

    def test_tampered_audio_and_manifest_provenance(self):
        source, binding = self.binding()
        v.import_manual(self.job, self.stage, source, binding)
        path = self.stage / self.job['recording_id'] / self.job['filename']
        path.write_bytes(media()[:-1])
        with self.assertRaises(ValueError):
            v.verify_staged(self.load()[0], self.stage)
        path.write_bytes(media())
        self.q['recordings'][0]['conditions'] += ' new restriction'
        with self.assertRaisesRegex(ValueError, 'Stale provenance'):
            v.verify_staged(self.load()[0], self.stage)

    def test_mp3_basic_integrity(self):
        self.assertEqual(v.mp3_info(media())['frames'], 2)
        self.assertEqual(v.mp3_info(b'ID3\x04\0\0\0\0\0\0' + media())['sample_rate'], 44100)
        for data in (b'', b'ID3', b'<html>error</html>', media()[:-1], media() + b'garbage'):
            with self.assertRaises(ValueError):
                v.mp3_info(data)

    def test_staging_and_atomic_overwrite_protection(self):
        with self.assertRaises(ValueError):
            v.safe_stage(v.ROOT / 'public/sounds/voices')
        path = self.base / 'atomic'
        v.exclusive(path, b'first')
        with self.assertRaises(FileExistsError):
            v.exclusive(path, b'second')
        self.assertEqual(path.read_bytes(), b'first')

    def test_cli_filters_dryrun_and_network_gate(self):
        with patch('urllib.request.OpenerDirector.open', side_effect=AssertionError('network forbidden')):
            with contextlib.redirect_stdout(io.StringIO()) as out:
                self.assertEqual(v.main(['generate', '--batch', 'Q90', '--priority', 'P0', '--model', 's2.1-pro', '--stage', str(self.stage)]), 0)
            self.assertEqual(out.getvalue().count('"dry_run": true'), 12)
            with contextlib.redirect_stdout(io.StringIO()) as out:
                self.assertEqual(v.main(['plan', '--recording-id', 'Q90-001', '--speaker', '689b47ca83dd48dba90b160affb8a118', '--json']), 0)
            self.assertEqual(json.loads(out.getvalue())['summary']['selected'], 1)
            for args in (['generate', '--execute', '--model', 's2.1-pro'], ['plan', '--recording-id', 'NV-096']):
                with contextlib.redirect_stderr(io.StringIO()):
                    self.assertEqual(v.main(args), 1)
        self.assertFalse(self.stage.exists())

    def test_official_rest_adapter_and_redirect_refusal(self):
        with patch('urllib.request.build_opener') as build:
            v.fish_request(v.request_body(self.job), 's2.1-pro', 'adapter-secret')
        handler = build.call_args.args[0]
        self.assertIsInstance(handler, v.NoRedirect)
        self.assertIsNone(handler.redirect_request(None, None, 302, '', {}, 'https://other.invalid'))
        request = build.return_value.open.call_args.args[0]
        self.assertEqual(request.full_url, 'https://api.fish.audio/v1/tts')
        self.assertEqual(request.get_method(), 'POST')
        self.assertEqual(request.get_header('Authorization'), 'Bearer adapter-secret')
        self.assertEqual(request.get_header('Model'), 's2.1-pro')
        self.assertEqual(json.loads(request.data), v.request_body(self.job))

    def test_cli_single_execute_uses_mocked_http(self):
        with patch('urllib.request.build_opener') as build, contextlib.redirect_stdout(io.StringIO()) as out:
            build.return_value.open.return_value = Response(media())
            self.assertEqual(v.main(['generate', '--recording-id', 'Q90-001', '--model', 's2.1-pro',
                                     '--stage', str(self.stage), '--execute']), 0)
        build.return_value.open.assert_called_once()
        self.assertNotIn('secret-test-key', out.getvalue())
        self.assertEqual(v.verify_staged(v.load_jobs()[0], self.stage)[0]['state'], 'complete-pending-QC')

    def test_cli_resume_lists_skipped_attempts(self):
        (self.stage / 'Q90-001').mkdir(parents=True)
        with contextlib.redirect_stdout(io.StringIO()) as out:
            self.assertEqual(v.main(['plan', '--batch', 'Q90', '--only-orderable', '--stage', str(self.stage), '--json']), 0)
        result = json.loads(out.getvalue())
        self.assertEqual(result['summary']['selected'], 86)
        self.assertEqual(result['summary']['skipped_unavailable'], ['Q90-001'])

    def test_response_rate_error_after_stream_start_is_ambiguous(self):
        response = Mock()
        response.__enter__ = Mock(return_value=response)
        response.__exit__ = Mock(return_value=False)
        response.headers = Response.headers
        response.read.side_effect = urllib.error.HTTPError('url', 429, 'rate', {}, None)
        transport = Mock(return_value=response)
        with self.assertRaises(ValueError):
            self.execute(transport, retries=2)
        transport.assert_called_once()
        self.assertEqual(v.read(sorted(self.stage.rglob('event-*.json'))[-1])['state'], 'ambiguous')

    def test_queue_report_is_deterministic(self):
        with contextlib.redirect_stdout(io.StringIO()) as first:
            self.assertEqual(v.main(['plan', '--stage', str(self.stage)]), 0)
        with contextlib.redirect_stdout(io.StringIO()) as second:
            self.assertEqual(v.main(['plan', '--stage', str(self.stage)]), 0)
        self.assertEqual(first.getvalue(), second.getvalue())


if __name__ == '__main__':
    unittest.main()
