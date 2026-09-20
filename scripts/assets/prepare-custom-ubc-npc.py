#!/usr/bin/env python3
"""Compose + optimize custom Quaternius UBC profession NPCs from repo-local sources.

Reads authored outfit GLBs under docs/blender/sources/characters/custom/,
composes shared head/eyes/hair/beard from the vendored UBC subset, and writes
runtime GLBs under public/models/characters/ubc/npc/.

Never reads `_temp/`.
"""

from __future__ import annotations

import argparse
import os
import shutil
import struct
import subprocess
import sys
import tempfile
from typing import Any

# Allow `python3 scripts/assets/prepare-custom-ubc-npc.py` from repo root.
_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if _SCRIPT_DIR not in sys.path:
    sys.path.insert(0, _SCRIPT_DIR)

from ubc_gltf import (  # noqa: E402
    GltfDoc,
    add_skinned_mesh,
    append_bytes,
    write_doc,
)

ROOT = os.path.abspath(os.path.join(_SCRIPT_DIR, '../..'))

CHARACTERS = os.path.join(ROOT, 'docs/blender/sources/characters')
UBC_BASE = os.path.join(CHARACTERS, 'quaternius/ubc-base/Superhero_Male_FullBody.gltf')
HAIR_DIR = os.path.join(CHARACTERS, 'quaternius/hair')

HAIR_FILES = {
    'simple': os.path.join(HAIR_DIR, 'Hair_SimpleParted.gltf'),
}
BEARD_FILE = os.path.join(HAIR_DIR, 'Hair_Beard.gltf')
HAIR_NODE_NAMES = {
    'simple': 'Hair_SimpleParted',
}

# Asset-build only — not gameplay profession rules.
CUSTOM_NPCS: dict[str, dict[str, Any]] = {
    'blacksmith': {
        'source': os.path.join(CHARACTERS, 'custom/blacksmith/outfit.glb'),
        'output': os.path.join(ROOT, 'public/models/characters/ubc/npc/male_blacksmith.glb'),
        'sex': 'male',
        'hair': 'simple',
        'beard': True,
    },
    'woodcutter': {
        'source': os.path.join(CHARACTERS, 'custom/woodcutter/outfit.glb'),
        'output': os.path.join(ROOT, 'public/models/characters/ubc/npc/male_woodcutter.glb'),
        'sex': 'male',
        'hair': 'simple',
        'beard': False,
    },
}

def assert_no_temp(path: str) -> None:
    normalized = os.path.normpath(path)
    parts = normalized.replace('\\', '/').split('/')
    if '_temp' in parts:
        raise SystemExit(f'custom NPC build must not use _temp path: {path}')


def run(cmd: list[str]) -> None:
    print('+', ' '.join(cmd))
    subprocess.check_call(cmd)


def glb_to_gltf(src_glb: str, dest_gltf: str) -> None:
    """Convert authored GLB to external-buffer glTF inside a temp workdir."""
    assert_no_temp(src_glb)
    assert_no_temp(dest_gltf)
    os.makedirs(os.path.dirname(dest_gltf), exist_ok=True)
    run(['npx', '--yes', '@gltf-transform/cli', 'copy', src_glb, dest_gltf])


def decode_joints(doc: GltfDoc, accessor_index: int) -> tuple[list[int], dict[str, Any]]:
    acc = doc.accessor(accessor_index)
    raw = doc.read_accessor(accessor_index)
    ctype = acc['componentType']
    count = acc['count']
    if ctype == 5121:  # UNSIGNED_BYTE
        values = list(raw)
    elif ctype == 5123:  # UNSIGNED_SHORT
        values = list(struct.unpack('<' + 'H' * (len(raw) // 2), raw))
    else:
        raise SystemExit(f'{doc.path}: unsupported JOINTS_0 componentType {ctype}')
    if len(values) != count * 4:
        raise SystemExit(f'{doc.path}: JOINTS_0 length mismatch ({len(values)} vs {count * 4})')
    return values, acc


def decode_weights(doc: GltfDoc, accessor_index: int) -> list[float]:
    acc = doc.accessor(accessor_index)
    raw = doc.read_accessor(accessor_index)
    if acc['componentType'] != 5126:
        raise SystemExit(f'{doc.path}: expected float WEIGHTS_0, got {acc["componentType"]}')
    values = list(struct.unpack('<' + 'f' * (len(raw) // 4), raw))
    if len(values) != acc['count'] * 4:
        raise SystemExit(f'{doc.path}: WEIGHTS_0 length mismatch')
    return values


def strip_animations(doc: GltfDoc) -> None:
    if 'animations' in doc.j:
        count = len(doc.j['animations'])
        doc.j.pop('animations', None)
        print(f'  stripped {count} animation clip(s)')


def validate_custom_outfit(doc: GltfDoc, canonical_names: set[str]) -> None:
    """Fail-fast source checks before composition."""
    meshes = doc.j.get('meshes') or []
    if not meshes:
        raise SystemExit(f'{doc.path}: no meshes')

    skins = doc.j.get('skins') or []
    if len(skins) != 1:
        raise SystemExit(f'{doc.path}: expected exactly one skin, got {len(skins)}')

    for node in doc.nodes():
        name = node.get('name') or ''
        if name.startswith('WGTS_') or name == 'WGTS_rig':
            raise SystemExit(f'{doc.path}: Blender helper node leaked into export: {name}')

    joint_names = doc.joint_names()
    missing_canon = [n for n in sorted(canonical_names) if n not in {jn for jn in joint_names}]
    # Canonical bones must exist as nodes (may be a subset of the exported skin list).
    node_names = {n.get('name', '') for n in doc.nodes()}
    missing_nodes = [n for n in sorted(canonical_names) if n not in node_names]
    if missing_nodes:
        raise SystemExit(
            f'{doc.path}: UBC joints missing from node graph: {missing_nodes}'
        )

    for mesh in meshes:
        mesh_name = mesh.get('name', '<unnamed>')
        for pi, prim in enumerate(mesh.get('primitives', [])):
            attrs = prim.get('attributes', {})
            has_j = 'JOINTS_0' in attrs
            has_w = 'WEIGHTS_0' in attrs
            if has_j or has_w:
                if not has_j or not has_w:
                    raise SystemExit(
                        f'{doc.path}: mesh {mesh_name} prim {pi} skinned attrs incomplete '
                        f'(JOINTS_0={has_j}, WEIGHTS_0={has_w})'
                    )
                joints, _acc = decode_joints(doc, attrs['JOINTS_0'])
                weights = decode_weights(doc, attrs['WEIGHTS_0'])
                for vi in range(len(weights) // 4):
                    for k in range(4):
                        ji = joints[vi * 4 + k]
                        w = weights[vi * 4 + k]
                        if w <= 0.0:
                            continue
                        if ji >= len(joint_names):
                            raise SystemExit(
                                f'{doc.path}: mesh {mesh_name} prim {pi} vert {vi}: '
                                f'joint index {ji} out of range'
                            )
                        name = joint_names[ji]
                        if name not in canonical_names:
                            raise SystemExit(
                                f'{doc.path}: mesh {mesh_name} prim {pi} vert {vi}: '
                                f'positive-weight joint {name!r} is not on the UBC skeleton'
                            )

    _ = missing_canon  # skin list may include helpers; positive-weight check above is authoritative
    print(f'  validated {len(meshes)} mesh(es), {len(joint_names)} exported joints')


def normalize_skin_to_ubc(doc: GltfDoc, canonical: GltfDoc) -> None:
    """Rewrite skin.joints to the 65-bone UBC set and remap JOINTS_0 by name."""
    canon_names = canonical.joint_names()
    nodes = doc.nodes()
    name_to_node = {n.get('name', ''): i for i, n in enumerate(nodes)}
    new_joint_nodes: list[int] = []
    for name in canon_names:
        if name not in name_to_node:
            raise SystemExit(f'{doc.path}: cannot map UBC joint {name!r} — node missing')
        new_joint_nodes.append(name_to_node[name])

    old_names = doc.joint_names()
    dest_index = {name: i for i, name in enumerate(canon_names)}
    canon_set = set(canon_names)

    # Reorder inverse bind matrices to match the new joint list.
    skin = doc.j['skins'][0]
    if 'inverseBindMatrices' in skin:
        ibm_acc = skin['inverseBindMatrices']
        ibm_raw = doc.read_accessor(ibm_acc)
        if len(ibm_raw) != 64 * len(old_names):
            raise SystemExit(
                f'{doc.path}: inverseBindMatrices size {len(ibm_raw)} '
                f'does not match {len(old_names)} joints'
            )
        old_name_to_i = {name: i for i, name in enumerate(old_names)}
        new_ibm = bytearray()
        for name in canon_names:
            old_i = old_name_to_i.get(name)
            if old_i is None:
                raise SystemExit(f'{doc.path}: no IBM for UBC joint {name!r}')
            new_ibm.extend(ibm_raw[old_i * 64:(old_i + 1) * 64])
        view = append_bytes(doc, bytes(new_ibm), 34963)
        doc.j['accessors'].append({
            'bufferView': view,
            'componentType': 5126,
            'count': len(canon_names),
            'type': 'MAT4',
        })
        skin['inverseBindMatrices'] = len(doc.j['accessors']) - 1

    skin['joints'] = new_joint_nodes

    for mesh in doc.j.get('meshes', []):
        mesh_name = mesh.get('name', '<unnamed>')
        for pi, prim in enumerate(mesh.get('primitives', [])):
            attrs = prim.get('attributes', {})
            if 'JOINTS_0' not in attrs:
                continue
            joints, jacc = decode_joints(doc, attrs['JOINTS_0'])
            weights = decode_weights(doc, attrs['WEIGHTS_0'])
            out = bytearray(len(joints))  # UNSIGNED_BYTE VEC4
            for vi in range(len(weights) // 4):
                for k in range(4):
                    ji = joints[vi * 4 + k]
                    w = weights[vi * 4 + k]
                    name = old_names[ji] if ji < len(old_names) else ''
                    if w > 0.0 and name not in canon_set:
                        raise SystemExit(
                            f'{doc.path}: mesh {mesh_name} prim {pi} vert {vi}: '
                            f'positive-weight joint {name!r} unmapped'
                        )
                    out[vi * 4 + k] = dest_index.get(name, 0) if name in canon_set else 0

            # Replace accessor with UNSIGNED_BYTE joints (65 bones fit in u8).
            view = append_bytes(doc, bytes(out), 34962)
            new_acc = {
                'bufferView': view,
                'componentType': 5121,
                'count': jacc['count'],
                'type': 'VEC4',
            }
            if 'normalized' in jacc:
                new_acc['normalized'] = jacc['normalized']
            doc.j['accessors'].append(new_acc)
            attrs['JOINTS_0'] = len(doc.j['accessors']) - 1

    print(f'  normalized skin to {len(canon_names)} UBC joints')


def relocate_images(doc: GltfDoc, out_dir: str) -> None:
    for image in doc.j.get('images', []):
        uri = image.get('uri')
        if not uri:
            # Embedded images after some converters — force fail; copy should externalize.
            raise SystemExit(f'{doc.path}: embedded image not supported after GLB convert')
        src = os.path.join(doc.dir, uri)
        if not os.path.isfile(src):
            src = os.path.join(doc.dir, os.path.basename(uri))
        if not os.path.isfile(src):
            raise SystemExit(f'{doc.path}: missing image {uri}')
        dest_name = os.path.basename(uri)
        dest = os.path.join(out_dir, dest_name)
        if os.path.abspath(src) != os.path.abspath(dest):
            shutil.copy2(src, dest)
        image['uri'] = dest_name


def compose_custom(
    outfit_gltf: str,
    base_gltf: str,
    hair_gltf: str | None,
    beard_gltf: str | None,
    out_gltf: str,
    label: str,
    hair_kind: str | None,
) -> None:
    out_dir = os.path.dirname(out_gltf)
    os.makedirs(out_dir, exist_ok=True)

    base = GltfDoc(base_gltf)
    canon_names = set(base.joint_names())

    dest = GltfDoc(outfit_gltf)
    validate_custom_outfit(dest, canon_names)
    strip_animations(dest)
    normalize_skin_to_ubc(dest, base)
    relocate_images(dest, out_dir)

    mat_map: dict[int, int] = {}
    tex_map: dict[int, int] = {}
    print(f'Composing {label}')
    add_skinned_mesh(dest, base, 0, 'Eyebrows', out_dir, mat_map, tex_map)
    add_skinned_mesh(dest, base, 1, 'Eyes', out_dir, mat_map, tex_map)
    add_skinned_mesh(dest, base, 2, 'HeadSkin', out_dir, mat_map, tex_map, slice_head=True)

    if hair_kind:
        if not hair_gltf:
            raise SystemExit(f'{label}: hair kind {hair_kind} without hair glTF')
        hair = GltfDoc(hair_gltf)
        add_skinned_mesh(dest, hair, 0, HAIR_NODE_NAMES[hair_kind], out_dir, {}, {})
    if beard_gltf:
        beard = GltfDoc(beard_gltf)
        add_skinned_mesh(dest, beard, 0, 'Hair_Beard', out_dir, {}, {})

    if dest.j.get('animations'):
        raise SystemExit(f'{label}: animations survived composition')
    write_doc(dest, out_gltf)
    print(f'  wrote {out_gltf}')


def optimize_glb(src_gltf: str, dest_glb: str, texture_size: int, work: str) -> None:
    """Match prepare-ubc-player-alpha.sh: copy → resize → webp → prune → gltfpack -cc -kn."""
    tmp = os.path.join(work, os.path.basename(dest_glb) + '.tmp.glb')
    os.makedirs(os.path.dirname(dest_glb), exist_ok=True)
    # Do not use `gltf-transform optimize` — flatten would collapse the UBC armature.
    run(['npx', '--yes', '@gltf-transform/cli', 'copy', src_gltf, tmp])
    run([
        'npx', '--yes', '@gltf-transform/cli', 'resize', tmp, tmp,
        '--width', str(texture_size), '--height', str(texture_size),
    ])
    run(['npx', '--yes', '@gltf-transform/cli', 'webp', tmp, tmp])
    run(['npx', '--yes', '@gltf-transform/cli', 'prune', tmp, tmp])
    run(['npx', '--yes', 'gltfpack', '-cc', '-kn', '-i', tmp, '-o', dest_glb])
    size = os.path.getsize(dest_glb)
    print(f'wrote {dest_glb} ({size / 1024:.1f} KiB)')


def build_one(npc_id: str, work: str) -> None:
    if npc_id not in CUSTOM_NPCS:
        raise SystemExit(f'unknown custom NPC {npc_id!r}; known: {sorted(CUSTOM_NPCS)}')
    cfg = CUSTOM_NPCS[npc_id]
    source = cfg['source']
    output = cfg['output']
    hair_kind = cfg.get('hair')
    texture_size = int(cfg.get('textureSize', 512))

    for path in (source, UBC_BASE, output):
        assert_no_temp(path)
    if not os.path.isfile(source):
        raise SystemExit(f'missing outfit source {source}')
    if not os.path.isfile(UBC_BASE):
        raise SystemExit(f'missing UBC base {UBC_BASE}')

    hair_gltf = None
    if hair_kind:
        hair_gltf = HAIR_FILES.get(hair_kind)
        if not hair_gltf or not os.path.isfile(hair_gltf):
            raise SystemExit(f'missing hair source for {hair_kind!r}: {hair_gltf}')
        assert_no_temp(hair_gltf)

    beard_gltf = None
    if cfg.get('beard'):
        beard_gltf = BEARD_FILE
        if not os.path.isfile(beard_gltf):
            raise SystemExit(f'missing beard source {beard_gltf}')
        assert_no_temp(beard_gltf)

    npc_work = os.path.join(work, npc_id)
    os.makedirs(npc_work, exist_ok=True)
    converted = os.path.join(npc_work, 'outfit.gltf')
    composed = os.path.join(npc_work, f'{npc_id}_composed.gltf')

    print(f'=== {npc_id} ===')
    glb_to_gltf(source, converted)
    compose_custom(
        converted,
        UBC_BASE,
        hair_gltf,
        beard_gltf,
        composed,
        npc_id,
        hair_kind,
    )
    optimize_glb(composed, output, texture_size, npc_work)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('ids', nargs='*', help='custom NPC ids to build')
    parser.add_argument('--all', action='store_true', help='build every manifest entry')
    args = parser.parse_args()

    if args.all:
        ids = list(CUSTOM_NPCS)
    elif args.ids:
        ids = args.ids
    else:
        parser.error('pass NPC id(s) or --all')

    work = tempfile.mkdtemp(prefix='seedvale-custom-ubc-npc.')
    try:
        for npc_id in ids:
            build_one(npc_id, work)
    finally:
        shutil.rmtree(work, ignore_errors=True)


if __name__ == '__main__':
    main()
