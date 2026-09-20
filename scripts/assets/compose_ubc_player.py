#!/usr/bin/env python3
"""Compose UBC Fantasy runtime glTFs (outfit + sliced head + optional hair).

Male player outfits plus female Peasant/Wizard for profession NPCs,
npc-040 hair/beard variant GLBs under `npc/`, and V1 skinned pauldron
accessories. Does not touch `_temp/` sources. Writes a work directory of
glTF + textures for a later gltf-transform / gltfpack pass.
"""

from __future__ import annotations

import argparse
import os
import shutil

from ubc_gltf import (
    GltfDoc,
    add_skinned_mesh,
    detach_headgear,
    resolve_image_file,
    write_doc,
)

# Helmeted player Knight keeps Armet (hair=None). Guard NPCs use the
# unhelmeted singleton (Armet stripped + Hair_SimpleParted) — not the npc/ matrix.
# hair: None | 'simple' | 'long'. sex: 'male' | 'female'. drop_headgear: bool.
OUTFITS: tuple[tuple[str, str, str | None, str, bool], ...] = (
    ('Male_Peasant', 'male_peasant', 'simple', 'male', False),
    ('Male_Ranger', 'male_ranger', 'simple', 'male', False),
    ('Male_Knight', 'male_knight', None, 'male', False),
    ('Male_Knight', 'male_knight_unhelmeted', 'simple', 'male', True),
    ('Male_Knight_Cloth', 'male_knight_cloth', None, 'male', False),
    ('Male_Noble', 'male_noble', 'simple', 'male', False),
    ('Male_Wizard', 'male_wizard', 'simple', 'male', False),
    ('Female_Peasant', 'female_peasant', 'long', 'female', False),
    ('Female_Wizard', 'female_wizard', 'long', 'female', False),
    ('Female_Ranger', 'female_ranger', 'long', 'female', False),
)

# Player defaults reused by NPC resolver — do not emit duplicate NPC GLBs.
# Male Knight stays helmeted on the player mesh; guard uses male_knight_unhelmeted.
# Female outfits always bake Hair_Long as the stem; Hair_Buns is the only extra.
PLAYER_DEFAULT_NPC_COMBOS: frozenset[tuple[str, str, str, bool]] = frozenset({
    ('male', 'peasant', 'simple', False),
    ('female', 'peasant', 'long', False),
    ('male', 'wizard', 'simple', False),
    ('male', 'ranger', 'simple', False),
})

MALE_HAIR_KINDS: tuple[str, ...] = ('simple', 'long', 'buzzed')
FEMALE_HAIR_KINDS: tuple[str, ...] = ('long', 'buns')

ALT_ALBEDOS: tuple[tuple[str, str], ...] = (
    ('Textures/Peasant/T_Peasant_2_BaseColor.png', 'male_peasant_brown.png'),
    ('Textures/Ranger/T_Ranger_3_BaseColor.png', 'male_ranger_brown.png'),
    ('Textures/Knight/T_Knight_2_BaseColor.png', 'male_knight_brown.png'),
    ('Textures/Knight/T_Knight_2_BaseColor.png', 'male_knight_cloth_brown.png'),
    ('Textures/Noble/T_Noble_2_BaseColor.png', 'male_noble_brown.png'),
    ('Textures/Wizard/T_Wizard_2_BaseColor.png', 'male_wizard_brown.png'),
    ('Textures/Peasant/T_Peasant_3_BaseColor.png', 'npc_peasant.png'),
    ('Textures/Peasant/T_Peasant_2_BaseColor.png', 'npc_woodcutter.png'),
    ('Textures/Wizard/T_Wizard_3_BaseColor.png', 'npc_wizard.png'),
    ('Textures/Ranger/T_Ranger_2_BaseColor.png', 'npc_ranger.png'),
    ('Textures/Knight/T_Knight_3_BaseColor.png', 'npc_knight.png'),
)

HAIR_NODE_NAMES = {
    'simple': 'Hair_SimpleParted',
    'long': 'Hair_Long',
    'buzzed': 'Hair_Buzzed',
    'buns': 'Hair_Buns',
}


# Modular accessory parts (plan items-player-039). Lion stays source-only.
ACCESSORIES: tuple[tuple[str, str], ...] = (
    ('Male_Noble_Acc_Pauldron', 'male_leather_pauldron'),
    ('Male_Ranger_Acc_Pauldron', 'male_ranger_pauldron'),
    ('Male_Knight_Acc_Pauldron_Spike', 'male_knight_pauldron_spike'),
    ('Male_Knight_Acc_Pauldron_Round', 'male_knight_pauldron_round'),
)


def compose_accessory(src_gltf: str, out_gltf: str, label: str) -> None:
    """Pack a skinned modular part with collocated textures; no head/hair/clips."""
    out_dir = os.path.dirname(out_gltf)
    os.makedirs(out_dir, exist_ok=True)
    dest = GltfDoc(src_gltf)
    print(f'Composing accessory {label}')
    for image in dest.j.get('images', []):
        uri = image.get('uri')
        if not uri:
            continue
        src_file = resolve_image_file(dest, image)
        dest_name = os.path.basename(uri)
        shutil.copy2(src_file, os.path.join(out_dir, dest_name))
        image['uri'] = dest_name
    write_doc(dest, out_gltf)


def compose_outfit(
    outfit_gltf: str,
    base_gltf: str,
    hair_gltf: str | None,
    out_gltf: str,
    label: str,
    hair_kind: str | None,
    beard_gltf: str | None = None,
    hair_node_name: str | None = None,
    drop_headgear: bool = False,
) -> None:
    out_dir = os.path.dirname(out_gltf)
    os.makedirs(out_dir, exist_ok=True)
    dest = GltfDoc(outfit_gltf)
    if drop_headgear:
        detach_headgear(dest)
    # Copy existing outfit textures next to the composed glTF.
    for image in dest.j.get('images', []):
        uri = image.get('uri')
        if uri:
            shutil.copy2(os.path.join(dest.dir, uri), os.path.join(out_dir, os.path.basename(uri)))
            image['uri'] = os.path.basename(uri)

    base = GltfDoc(base_gltf)
    mat_map: dict[int, int] = {}
    tex_map: dict[int, int] = {}

    print(f'Composing {label}')
    # Superhero meshes: 0 Face (eyebrows), 1 Face.001 (eyes), 2 body (slice head).
    add_skinned_mesh(dest, base, 0, 'Eyebrows', out_dir, mat_map, tex_map)
    add_skinned_mesh(dest, base, 1, 'Eyes', out_dir, mat_map, tex_map)
    add_skinned_mesh(dest, base, 2, 'HeadSkin', out_dir, mat_map, tex_map, slice_head=True)
    if hair_kind:
        if not hair_gltf:
            raise SystemExit(f'{label}: hair kind {hair_kind} without hair glTF')
        hair = GltfDoc(hair_gltf)
        node_name = hair_node_name or HAIR_NODE_NAMES[hair_kind]
        add_skinned_mesh(dest, hair, 0, node_name, out_dir, {}, {})
    if beard_gltf:
        beard = GltfDoc(beard_gltf)
        add_skinned_mesh(dest, beard, 0, 'Hair_Beard', out_dir, {}, {})
    write_doc(dest, out_gltf)
    print(f'  wrote {out_gltf}')


def copy_alt_albedos(outfits_root: str, out_dir: str) -> None:
    """Copy brown/NPC BaseColor variants next to composed glTFs (runtime loads them separately)."""
    for rel, dest_name in ALT_ALBEDOS:
        src = os.path.join(outfits_root, rel)
        if not os.path.isfile(src):
            raise SystemExit(f'missing alt albedo {src}')
        dest = os.path.join(out_dir, dest_name)
        shutil.copy2(src, dest)
        print(f'  copied alt albedo {dest_name}')


def copy_hair_albedos(ubc_root: str, out_dir: str) -> None:
    """Hair color sidecars — runtime swap on MI_Hair_* (npc-040)."""
    src_dir = os.path.join(ubc_root, 'Hairstyles/Textures')
    for src_name, dest_name in (
        ('T_Hair_1_BaseColor.png', 'hair_1.png'),
        ('T_Hair_2_BaseColor.png', 'hair_2.png'),
    ):
        src = os.path.join(src_dir, src_name)
        if not os.path.isfile(src):
            raise SystemExit(f'missing hair albedo {src}')
        dest = os.path.join(out_dir, dest_name)
        shutil.copy2(src, dest)
        print(f'  copied hair albedo {dest_name}')


def hair_file_for(ubc: str, hair_kind: str) -> tuple[str, str]:
    hair_dir = os.path.join(ubc, 'Hairstyles/Rigged to Head Bone/glTF (Godot -Unreal)')
    stem = HAIR_NODE_NAMES[hair_kind]
    return os.path.join(hair_dir, f'{stem}.gltf'), stem


def npc_variant_rows() -> list[tuple[str, str, str, str, bool, bool]]:
    rows: list[tuple[str, str, str, str, bool, bool]] = []
    for sex, src_prefix, classes in (
        ('male', 'Male', ('Peasant', 'Wizard', 'Ranger')),
        ('female', 'Female', ('Peasant', 'Wizard', 'Ranger')),
    ):
        hairs = FEMALE_HAIR_KINDS if sex == 'female' else MALE_HAIR_KINDS
        for cls in classes:
            outfit = cls.lower()
            drop_headgear = cls == 'Knight'
            beards = (False, True) if sex == 'male' else (False,)
            for hair_kind in hairs:
                for beard in beards:
                    if (sex, outfit, hair_kind, beard) in PLAYER_DEFAULT_NPC_COMBOS:
                        continue
                    dest = f'{sex}_{outfit}_{hair_kind}'
                    if beard:
                        dest += '_beard'
                    rows.append((f'{src_prefix}_{cls}', dest, hair_kind, sex, beard, drop_headgear))
    return rows


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', required=True)
    parser.add_argument('--out-dir', required=True)
    parser.add_argument(
        '--stems',
        nargs='*',
        default=None,
        help='exact dest stems to compose; omit to compose everything',
    )
    args = parser.parse_args()
    stem_set = set(args.stems) if args.stems else None

    def wanted(stem: str) -> bool:
        return stem_set is None or stem in stem_set

    people = os.path.join(args.root, '_temp/Models/people')
    ubc = os.path.join(people, 'Universal Base Characters[Standard]')
    outfits = os.path.join(people, 'Modular Character Outfits - Fantasy[Source]')
    bases = {
        'male': os.path.join(ubc, 'Base Characters/Godot - UE/Superhero_Male_FullBody.gltf'),
        'female': os.path.join(ubc, 'Base Characters/Godot - UE/Superhero_Female_FullBody.gltf'),
    }
    hairs = {
        'simple': os.path.join(ubc, 'Hairstyles/Rigged to Head Bone/glTF (Godot -Unreal)/Hair_SimpleParted.gltf'),
        'long': os.path.join(ubc, 'Hairstyles/Rigged to Head Bone/glTF (Godot -Unreal)/Hair_Long.gltf'),
    }
    beard_gltf = os.path.join(ubc, 'Hairstyles/Rigged to Head Bone/glTF (Godot -Unreal)/Hair_Beard.gltf')
    outfit_dir = os.path.join(outfits, 'Exports/glTF (Godot-Unreal)/Outfits')
    modular_dir = os.path.join(outfits, 'Exports/glTF (Godot-Unreal)/Modular Parts')

    for path in (*bases.values(), *hairs.values(), beard_gltf):
        if not os.path.isfile(path):
            raise SystemExit(f'missing source {path}')

    os.makedirs(args.out_dir, exist_ok=True)
    accessory_dir = os.path.join(args.out_dir, 'accessories')
    os.makedirs(accessory_dir, exist_ok=True)
    for src_stem, dest_stem in ACCESSORIES:
        if not wanted(dest_stem):
            continue
        src = os.path.join(modular_dir, f'{src_stem}.gltf')
        if not os.path.isfile(src):
            raise SystemExit(f'missing source {src}')
        compose_accessory(src, os.path.join(accessory_dir, f'{dest_stem}.gltf'), dest_stem)

    for src_stem, dest_stem, hair_kind, sex, drop_headgear in OUTFITS:
        if not wanted(dest_stem):
            continue
        src = os.path.join(outfit_dir, f'{src_stem}.gltf')
        if not os.path.isfile(src):
            raise SystemExit(f'missing source {src}')
        compose_outfit(
            src,
            bases[sex],
            hairs[hair_kind] if hair_kind else None,
            os.path.join(args.out_dir, f'{dest_stem}.gltf'),
            dest_stem,
            hair_kind,
            drop_headgear=drop_headgear,
        )

    npc_dir = os.path.join(args.out_dir, 'npc')
    os.makedirs(npc_dir, exist_ok=True)
    for src_stem, dest_stem, hair_kind, sex, beard, drop_headgear in npc_variant_rows():
        if not wanted(dest_stem):
            continue
        src = os.path.join(outfit_dir, f'{src_stem}.gltf')
        if not os.path.isfile(src):
            raise SystemExit(f'missing source {src}')
        hair_path, hair_node = hair_file_for(ubc, hair_kind)
        if not os.path.isfile(hair_path):
            raise SystemExit(f'missing source {hair_path}')
        compose_outfit(
            src,
            bases[sex],
            hair_path,
            os.path.join(npc_dir, f'{dest_stem}.gltf'),
            dest_stem,
            hair_kind,
            beard_gltf if beard else None,
            hair_node,
            drop_headgear,
        )
    if stem_set is None:
        copy_alt_albedos(outfits, args.out_dir)
        copy_hair_albedos(ubc, args.out_dir)
    else:
        for rel, dest_name in ALT_ALBEDOS:
            stem, _ext = os.path.splitext(dest_name)
            if stem not in stem_set and dest_name not in stem_set:
                continue
            src = os.path.join(outfits, rel)
            if not os.path.isfile(src):
                raise SystemExit(f'missing alt albedo {src}')
            dest = os.path.join(args.out_dir, dest_name)
            shutil.copy2(src, dest)
            print(f'  copied alt albedo {dest_name}')


if __name__ == '__main__':
    main()
