#!/usr/bin/env python3
"""Unit tests for custom UBC NPC validation / skin normalization."""

from __future__ import annotations

import importlib.util
import json
import os
import shutil
import struct
import sys
import tempfile
import unittest

_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if _SCRIPT_DIR not in sys.path:
    sys.path.insert(0, _SCRIPT_DIR)

_spec = importlib.util.spec_from_file_location(
    'prepare_custom_ubc_npc',
    os.path.join(_SCRIPT_DIR, 'prepare-custom-ubc-npc.py'),
)
assert _spec and _spec.loader
_mod = importlib.util.module_from_spec(_spec)
sys.modules['prepare_custom_ubc_npc'] = _mod
_spec.loader.exec_module(_mod)

from ubc_gltf import GltfDoc  # noqa: E402


def _write_minimal_skinned(
    path: str,
    *,
    joint_names: list[str],
    joint_indices: list[int],
    weights: list[float],
    joint_ctype: int = 5121,
    include_anim: bool = False,
    helper_node: str | None = None,
) -> None:
    """Write a tiny external-buffer glTF with one skinned triangle."""
    assert len(joint_indices) == 4 and len(weights) == 4
    nodes: list[dict] = [{'name': 'Armature', 'children': []}]
    joint_node_indices: list[int] = []
    for name in joint_names:
        joint_node_indices.append(len(nodes))
        nodes.append({'name': name})
    mesh_i = len(nodes)
    nodes.append({'name': 'Body', 'mesh': 0, 'skin': 0})
    nodes[0]['children'] = joint_node_indices + [mesh_i]
    if helper_node:
        nodes[0]['children'].append(len(nodes))
        nodes.append({'name': helper_node})

    pos = struct.pack('<9f', 0, 0, 0, 1, 0, 0, 0, 1, 0)
    indices = struct.pack('<3H', 0, 1, 2)
    if joint_ctype == 5121:
        joints_one = bytes(joint_indices)
    else:
        joints_one = struct.pack('<' + 'H' * 4, *joint_indices)
    w_one = struct.pack('<' + 'f' * 4, *weights)
    joints3 = joints_one * 3
    weights3 = w_one * 3
    ibm = b''.join(
        struct.pack('<16f', 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
        for _ in joint_names
    )

    blob = bytearray()
    views: list[dict] = []
    accessors: list[dict] = []

    def add_view(data: bytes, target: int | None = None) -> int:
        while len(blob) % 4:
            blob.append(0)
        start = len(blob)
        blob.extend(data)
        view: dict = {'buffer': 0, 'byteOffset': start, 'byteLength': len(data)}
        if target is not None:
            view['target'] = target
        views.append(view)
        return len(views) - 1

    def add_acc(view_i: int, ctype: int, count: int, typ: str, **extra) -> int:
        acc = {'bufferView': view_i, 'componentType': ctype, 'count': count, 'type': typ, **extra}
        accessors.append(acc)
        return len(accessors) - 1

    pos_a = add_acc(add_view(pos, 34962), 5126, 3, 'VEC3', min=[0, 0, 0], max=[1, 1, 0])
    idx_a = add_acc(add_view(indices, 34963), 5123, 3, 'SCALAR')
    j_a = add_acc(add_view(joints3, 34962), joint_ctype, 3, 'VEC4')
    w_a = add_acc(add_view(weights3, 34962), 5126, 3, 'VEC4')
    ibm_a = add_acc(add_view(ibm), 5126, len(joint_names), 'MAT4')

    doc = {
        'asset': {'version': '2.0'},
        'scenes': [{'nodes': [0]}],
        'scene': 0,
        'nodes': nodes,
        'meshes': [{
            'name': 'Body',
            'primitives': [{
                'attributes': {'POSITION': pos_a, 'JOINTS_0': j_a, 'WEIGHTS_0': w_a},
                'indices': idx_a,
                'mode': 4,
            }],
        }],
        'skins': [{
            'joints': joint_node_indices,
            'inverseBindMatrices': ibm_a,
        }],
        'accessors': accessors,
        'bufferViews': views,
        'buffers': [{'byteLength': len(blob), 'uri': os.path.basename(path).replace('.gltf', '.bin')}],
    }
    if include_anim:
        doc['animations'] = [{'name': 'Idle_Loop', 'channels': [], 'samplers': []}]

    with open(path.replace('.gltf', '.bin'), 'wb') as f:
        f.write(blob)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(doc, f)


class AssertNoTempTests(unittest.TestCase):
    def test_rejects_temp(self) -> None:
        with self.assertRaises(SystemExit):
            _mod.assert_no_temp('/repo/_temp/Models/foo.glb')

    def test_allows_repo_path(self) -> None:
        _mod.assert_no_temp('/repo/docs/blender/sources/characters/custom/x/outfit.glb')


class SkinNormalizeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.mkdtemp(prefix='ubc-npc-test.')

    def tearDown(self) -> None:
        shutil.rmtree(self.tmp, ignore_errors=True)

    def _canonical(self) -> GltfDoc:
        path = os.path.join(self.tmp, 'canon.gltf')
        _write_minimal_skinned(
            path,
            joint_names=['root', 'pelvis', 'Head'],
            joint_indices=[0, 1, 2, 0],
            weights=[1.0, 0.0, 0.0, 0.0],
        )
        return GltfDoc(path)

    def test_positive_weight_unknown_joint_fails(self) -> None:
        outfit = os.path.join(self.tmp, 'outfit.gltf')
        _write_minimal_skinned(
            outfit,
            joint_names=['root', 'pelvis', 'Head', 'MCH-foot_ik.parent.L'],
            joint_indices=[3, 0, 0, 0],
            weights=[0.5, 0.5, 0.0, 0.0],
            joint_ctype=5123,
        )
        dest = GltfDoc(outfit)
        canon = self._canonical()
        with self.assertRaises(SystemExit) as ctx:
            _mod.validate_custom_outfit(dest, set(canon.joint_names()))
        self.assertIn('MCH-foot_ik.parent.L', str(ctx.exception))

    def test_zero_weight_helper_cleared_on_normalize(self) -> None:
        outfit = os.path.join(self.tmp, 'outfit.gltf')
        _write_minimal_skinned(
            outfit,
            joint_names=['root', 'pelvis', 'Head', 'MCH-foot_ik.parent.L'],
            joint_indices=[3, 1, 0, 0],
            weights=[0.0, 1.0, 0.0, 0.0],
            joint_ctype=5123,
            include_anim=True,
        )
        dest = GltfDoc(outfit)
        canon = self._canonical()
        _mod.validate_custom_outfit(dest, set(canon.joint_names()))
        _mod.strip_animations(dest)
        self.assertNotIn('animations', dest.j)
        _mod.normalize_skin_to_ubc(dest, canon)
        self.assertEqual(dest.joint_names(), ['root', 'pelvis', 'Head'])
        joints, acc = _mod.decode_joints(
            dest, dest.j['meshes'][0]['primitives'][0]['attributes']['JOINTS_0'],
        )
        self.assertEqual(acc['componentType'], 5121)
        self.assertEqual(joints[0], 0)
        self.assertEqual(joints[1], 1)

    def test_wgts_helper_node_rejected(self) -> None:
        outfit = os.path.join(self.tmp, 'outfit.gltf')
        _write_minimal_skinned(
            outfit,
            joint_names=['root', 'pelvis', 'Head'],
            joint_indices=[0, 0, 0, 0],
            weights=[1.0, 0.0, 0.0, 0.0],
            helper_node='WGTS_rig',
        )
        dest = GltfDoc(outfit)
        with self.assertRaises(SystemExit) as ctx:
            _mod.validate_custom_outfit(dest, {'root', 'pelvis', 'Head'})
        self.assertIn('WGTS_rig', str(ctx.exception))


class ManifestContractTests(unittest.TestCase):
    def test_profession_manifest_has_no_baked_hair(self) -> None:
        for npc_id, cfg in _mod.CUSTOM_NPCS.items():
            self.assertNotIn('hair', cfg, npc_id)
            self.assertNotIn('beard', cfg, npc_id)
            _mod.assert_no_temp(cfg['source'])
            _mod.assert_no_temp(cfg['output'])

    def test_hair_attachments_are_repo_local(self) -> None:
        expected = {'hair_simple', 'hair_long', 'beard'}
        self.assertEqual(set(_mod.HAIR_ATTACHMENTS), expected)
        for att_id, cfg in _mod.HAIR_ATTACHMENTS.items():
            _mod.assert_no_temp(cfg['source'])
            _mod.assert_no_temp(cfg['output'])
            self.assertTrue(
                os.path.isfile(cfg['source']),
                f'missing repo-local hair source for {att_id}: {cfg["source"]}',
            )
            _mod.validate_hair_attachment_source(cfg['source'])


if __name__ == '__main__':
    unittest.main()
