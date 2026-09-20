#!/usr/bin/env python3
"""Merge animation clips from a second GLB into a base GLB with the same node hierarchy.

Both inputs must share identical node names and order (UBC UAL1/UAL2). Duplicate
animation names are rejected. Mannequin mesh/skin payload should already be
stripped by extract_glb_clips.py.
"""

from __future__ import annotations

import argparse
import json
import struct
from typing import Any

COMPONENT_BYTES = {5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4}
TYPE_COMPONENTS = {
    'SCALAR': 1,
    'VEC2': 2,
    'VEC3': 3,
    'VEC4': 4,
    'MAT2': 4,
    'MAT3': 9,
    'MAT4': 16,
}


def read_glb(path: str) -> tuple[dict[str, Any], bytes]:
    data = open(path, 'rb').read()
    if data[0:4] != b'glTF':
        raise SystemExit(f'{path}: not a GLB')
    json_len = struct.unpack_from('<I', data, 12)[0]
    json_bytes = data[20:20 + json_len]
    doc = json.loads(json_bytes.rstrip(b'\x00'))
    offset = 20 + json_len
    bin_data = b''
    if offset + 8 <= len(data):
        chunk_len = struct.unpack_from('<I', data, offset)[0]
        chunk_type = struct.unpack_from('<I', data, offset + 4)[0]
        if chunk_type == 0x004E4942:
            bin_data = data[offset + 8:offset + 8 + chunk_len]
    return doc, bin_data


def write_glb(path: str, doc: dict[str, Any], bin_data: bytes) -> None:
    json_bytes = json.dumps(doc, separators=(',', ':')).encode('utf-8')
    while len(json_bytes) % 4:
        json_bytes += b' '
    bin_padded = bin_data + b'\x00' * ((4 - (len(bin_data) % 4)) % 4)
    total = 12 + 8 + len(json_bytes) + (8 + len(bin_padded) if bin_padded else 0)
    out = bytearray()
    out.extend(b'glTF')
    out.extend(struct.pack('<II', 2, total))
    out.extend(struct.pack('<II', len(json_bytes), 0x4E4F534A))
    out.extend(json_bytes)
    if bin_padded:
        out.extend(struct.pack('<II', len(bin_padded), 0x004E4942))
        out.extend(bin_padded)
    with open(path, 'wb') as f:
        f.write(out)


def accessor_bytes(doc: dict[str, Any], bin_data: bytes, index: int) -> bytes:
    acc = doc['accessors'][index]
    view = doc['bufferViews'][acc['bufferView']]
    start = view.get('byteOffset', 0) + acc.get('byteOffset', 0)
    comps = TYPE_COMPONENTS[acc['type']]
    elem = COMPONENT_BYTES[acc['componentType']] * comps
    count = acc['count']
    stride = view.get('byteStride') or elem
    if stride == elem:
        return bin_data[start:start + elem * count]
    out = bytearray()
    for i in range(count):
        off = start + i * stride
        out.extend(bin_data[off:off + elem])
    return bytes(out)


def node_names(doc: dict[str, Any]) -> list[str]:
    return [n.get('name', '') for n in doc.get('nodes', [])]


def merge(base_path: str, add_path: str, dest_path: str) -> None:
    base, base_bin = read_glb(base_path)
    add, add_bin = read_glb(add_path)

    if node_names(base) != node_names(add):
        raise SystemExit('node hierarchy mismatch between base and add GLBs')

    base_names = {a.get('name') for a in base.get('animations', [])}
    add_anims = add.get('animations', [])
    dupes = sorted({a.get('name') for a in add_anims} & base_names)
    if dupes:
        raise SystemExit(f'duplicate animation names: {dupes}')

    new_bin = bytearray(base_bin)
    new_views = list(base.get('bufferViews', []))
    new_accessors = list(base.get('accessors', []))
    animations = list(base.get('animations', []))

    def pad4() -> None:
        while len(new_bin) % 4:
            new_bin.append(0)

    for anim in add_anims:
        used: set[int] = set()
        for sampler in anim.get('samplers', []):
            used.add(sampler['input'])
            used.add(sampler['output'])

        acc_map: dict[int, int] = {}
        for old in sorted(used):
            data = accessor_bytes(add, add_bin, old)
            pad4()
            offset = len(new_bin)
            new_bin.extend(data)
            new_views.append({
                'buffer': 0,
                'byteOffset': offset,
                'byteLength': len(data),
            })
            acc = dict(add['accessors'][old])
            acc['bufferView'] = len(new_views) - 1
            acc.pop('byteOffset', None)
            new_accessors.append(acc)
            acc_map[old] = len(new_accessors) - 1

        merged = {
            'name': anim.get('name'),
            'samplers': [
                {
                    'input': acc_map[s['input']],
                    'output': acc_map[s['output']],
                    **({'interpolation': s['interpolation']} if 'interpolation' in s else {}),
                }
                for s in anim.get('samplers', [])
            ],
            'channels': [
                {
                    'sampler': ch['sampler'],
                    'target': dict(ch['target']),
                }
                for ch in anim.get('channels', [])
            ],
        }
        animations.append(merged)

    base['animations'] = animations
    base['accessors'] = new_accessors
    base['bufferViews'] = new_views
    base['buffers'] = [{'byteLength': len(new_bin)}]
    write_glb(dest_path, base, bytes(new_bin))
    print(
        f'merged {len(add_anims)} clips into base -> {dest_path} '
        f'({len(animations)} total, {len(new_bin)} bytes bin)'
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', required=True)
    parser.add_argument('--add', required=True)
    parser.add_argument('--out', required=True)
    args = parser.parse_args()
    merge(args.base, args.add, args.out)


if __name__ == '__main__':
    main()
