"""
Blender (dev-only) — authors the Blacksmith's classic leather work apron in the V1 master
`docs/blender/sources/characters/quaternius/outfits/Quaternius_Outfits_All_Male.blend` (2026-10-28).

Creates or replaces the single object `Male_Blacksmith_Apron` in the `Blacksmith` collection. Nothing else
in the master is touched (the author's tunic panel, belts, bracers and boots stay as authored).

Shape (character faces -Y, metres, rest pose):
  bib      waist -> upper chest, narrower at the top, conformed to the tunic, tucked under the authored belts
  strap    neck loop from the bib corners around the back of the neck
  skirt    waist -> just below the knee, hangs as a flat sheet in front of the thighs (no wrapping between
           the legs), with a centre slit from the hem to mid-thigh so each half follows its own thigh

Skinning: bib and strap copy weights from the Blacksmith tunic (nearest-face interpolation), so they deform
exactly like the cloth underneath. The skirt is weighted procedurally: pelvis at the waist blending into the
thigh of its side towards the hem. It carries no calf weight, so knee bends during walking never drag the
hem through the shins.

Run in Blender 5.x with the master open (Blender MCP `execute_blender_code` or Scripting workspace):
  exec(open(r'<repo>/scripts/assets/blender-blacksmith-apron.py').read())
The script does not save; save the master yourself after inspecting the result.
"""
import math

import bmesh
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree

APRON = 'Male_Blacksmith_Apron'
COLLECTION = 'Blacksmith'
MATERIAL = 'Blacksmith_Apron_Leather'
# Dark brown leather blackened by forge soot (scene-linear).
LEATHER = (0.032, 0.017, 0.009, 1.0)
TUNIC = 'Male_Blacksmith_Body'
LEGS = 'Male_Blacksmith_Legs'

Z_BIB_TOP = 1.45
Z_WAIST = 1.15
Z_HEM = 0.50          # ~4 cm below the knee joint (calf head at z 0.542)
Z_SLIT_TOP = 0.86     # centre slit: hem -> upper thigh (just below the tunic hem)
BIB_HALF = (0.10, 0.155)   # half width at bib top / waist
SKIRT_HALF = (0.185, 0.215)  # half width at waist / hem
OFFSET_BIB = 0.016     # above the tunic
OFFSET_BELT = 0.008    # under the authored belts (z 1.123-1.175, front ~2 cm proud of the tunic)
BELT_BAND = (1.105, 1.19)
OFFSET_SKIRT = 0.022
SIDE_CURL = 0.045      # skirt edges bend back towards the body by this much
COLS = 12
BIB_ROWS = 6
SKIRT_ROWS = 14
STRAP_W = 0.022
STRAP_SEGMENTS = 14


def evaluated_bvh(names):
    """World-space BVH of the evaluated (rest pose) meshes, plus the source mesh copy for weight transfer."""
    dg = bpy.context.evaluated_depsgraph_get()
    bm = bmesh.new()
    for n in names:
        o = bpy.data.objects[n]
        me = o.evaluated_get(dg).to_mesh()
        me.transform(o.matrix_world)
        bm.from_mesh(me)
        o.evaluated_get(dg).to_mesh_clear()
    bm.verts.ensure_lookup_table()
    return BVHTree.FromBMesh(bm), bm


def front_hit(bvh, x, z):
    """Frontmost (-Y) body surface y at (x, z), or None when the ray misses (between the thighs)."""
    hit = bvh.ray_cast(Vector((x, -1.0, z)), Vector((0, 1, 0)))
    return hit[0].y if hit[0] is not None else None


def lerp(a, b, t):
    return a + (b - a) * t


def build_grid(bvh):
    """Rows of (kind, z, [(x, y, z)]) from bib top to hem."""
    rows = []
    for j in range(BIB_ROWS + 1):
        t = j / BIB_ROWS
        z = lerp(Z_BIB_TOP, BELT_BAND[1], t)
        rows.append(('bib', z, lerp(BIB_HALF[0], BIB_HALF[1], (Z_BIB_TOP - z) / (Z_BIB_TOP - Z_WAIST))))
    for z in (1.165, Z_WAIST - 0.015, 1.12):
        rows.append(('belt', z, BIB_HALF[1]))
    rows.append(('belt', BELT_BAND[0], lerp(BIB_HALF[1], SKIRT_HALF[0], 0.5)))
    z_skirt = BELT_BAND[0]
    for j in range(1, SKIRT_ROWS + 1):
        t = j / SKIRT_ROWS
        w = lerp(SKIRT_HALF[0], SKIRT_HALF[1], t)
        rows.append(('skirt', lerp(z_skirt, Z_HEM, t), w))

    grid = []
    for kind, z, hw in rows:
        xs = [-hw + 2 * hw * i / COLS for i in range(COLS + 1)]
        hits = [front_hit(bvh, x, z) for x in xs]
        if kind in ('bib', 'belt'):
            # Bib hugs the tunic; inside the belt band it lies flat on the tunic so the authored belts stay on top.
            off = OFFSET_BIB if kind == 'bib' else OFFSET_BELT
            known = [v for v in hits if v is not None]
            pts = [(x, (h if h is not None else min(known)) - off, z) for x, h in zip(xs, hits)]
        else:
            known = [h for h in hits if h is not None]
            flat = min(known) - OFFSET_SKIRT
            pts = []
            for x, h in zip(xs, hits):
                curl = flat + SIDE_CURL * (x / hw) ** 2
                y = curl if h is None else min(curl, h - OFFSET_SKIRT)
                pts.append((x, y, z))
        grid.append((kind, z, pts))
    return grid


def smooth_skirt_depth(grid):
    """Keep the hanging sheet monotonic: below the waist a row never sits behind the row above it."""
    for r in range(1, len(grid)):
        kind, z, pts = grid[r]
        if kind != 'skirt':
            continue
        prev = grid[r - 1][2]
        grid[r] = (kind, z, [(x, min(y, prev[i][1] + 0.004) if z < 0.92 else y, zz)
                             for i, (x, y, zz) in enumerate(pts)])


def make_mesh(grid):
    bm = bmesh.new()
    mid = COLS // 2
    verts = []
    for kind, z, pts in grid:
        row = [bm.verts.new(p) for p in pts]
        verts.append(row)
    # Centre slit: duplicate the middle column below Z_SLIT_TOP; the right half uses the copy.
    right_mid = {}
    for r, (kind, z, pts) in enumerate(grid):
        if z < Z_SLIT_TOP - 1e-6:
            right_mid[r] = bm.verts.new(pts[mid])
    uv_rows = len(grid) - 1
    faces = []
    for r in range(len(grid) - 1):
        for i in range(COLS):
            def v(rr, ii):
                if ii == mid and i >= mid and rr in right_mid:
                    return right_mid[rr]
                return verts[rr][ii]
            f = bm.faces.new((v(r, i), v(r, i + 1), v(r + 1, i + 1), v(r + 1, i)))
            faces.append((f, r, i))
    uvl = bm.loops.layers.uv.new('UVMap')
    for f, r, i in faces:
        for lp, (du, dv) in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))):
            lp[uvl].uv = ((i + du) / COLS, 1 - (r + dv) / uv_rows)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    # Normals must face away from the body (-Y).
    if sum(f.normal.y for f in bm.faces) > 0:
        bmesh.ops.reverse_faces(bm, faces=bm.faces)
    return bm


def add_strap(bm, bvh, grid):
    """Neck loop: ribbon from each bib top corner over the trapezius and around the back of the neck."""
    _, z, pts = grid[0]
    left, right = Vector(pts[-1]), Vector(pts[0])  # +X is the character's left
    path = []
    for k in range(STRAP_SEGMENTS + 1):
        a = math.pi * k / STRAP_SEGMENTS  # 0: front-left corner, pi: front-right corner, via the back
        # Ellipse around the neck base, rising to the collar at the sides and back.
        x = math.cos(a) * 0.085
        y = -math.sin(a) * -0.07 + 0.0
        zz = 1.505 + 0.035 * math.sin(a)
        path.append(Vector((x, y, zz)))
    # Blend the first/last points down to the bib corners.
    path = [left.lerp(path[2], t / 2) for t in range(2)] + path[2:-2] + [path[-3].lerp(right, t / 2) for t in range(1, 3)]
    ring = []
    for p in path:
        loc, nrm, _, _ = bvh.find_nearest(p)
        q = loc + nrm.normalized() * 0.012 if loc is not None else p
        ring.append(q)
    strap = []
    for k, q in enumerate(ring):
        d = (ring[min(k + 1, len(ring) - 1)] - ring[max(k - 1, 0)]).normalized()
        loc, nrm, _, _ = bvh.find_nearest(q)
        side = d.cross(nrm).normalized() * (STRAP_W / 2)
        strap.append((bm.verts.new(q - side), bm.verts.new(q + side)))
    uvl = bm.loops.layers.uv.active
    for k in range(len(strap) - 1):
        f = bm.faces.new((strap[k][0], strap[k][1], strap[k + 1][1], strap[k + 1][0]))
        for lp in f.loops:
            lp[uvl].uv = (0.5, 0.5)
        loc, nrm, _, _ = bvh.find_nearest(f.calc_center_median())
        f.normal_update()
        if f.normal.dot(nrm) < 0:
            f.normal_flip()


def material():
    mat = bpy.data.materials.get(MATERIAL) or bpy.data.materials.new(MATERIAL)
    mat.use_nodes = True
    bsdf = next(n for n in mat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    bsdf.inputs['Base Color'].default_value = LEATHER
    bsdf.inputs['Metallic'].default_value = 0.0
    bsdf.inputs['Roughness'].default_value = 0.85
    mat.diffuse_color = LEATHER
    return mat


def smoothstep(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def weight(obj, tunic):
    arm = bpy.data.objects['Armature']
    for vg in tunic.vertex_groups:
        obj.vertex_groups.new(name=vg.name)
    # Bib + strap (z above the waist) take the tunic weights.
    dt = obj.modifiers.new('Weights', 'DATA_TRANSFER')
    dt.object = tunic
    dt.use_vert_data = True
    dt.data_types_verts = {'VGROUP_WEIGHTS'}
    dt.vert_mapping = 'POLYINTERP_NEAREST'
    dt.layers_vgroup_select_src = 'ALL'
    dt.layers_vgroup_select_dst = 'NAME'
    with bpy.context.temp_override(object=obj, active_object=obj, selected_objects=[obj]):
        bpy.ops.object.modifier_apply(modifier=dt.name)
    groups = {vg.name: vg for vg in obj.vertex_groups}
    me = obj.data
    # Skirt: rebuild weights procedurally.
    blend = 0.06  # x range over which the two thighs mix above the slit
    for v in me.vertices:
        if v.co.z >= Z_WAIST - 1e-4:
            continue
        for vg in obj.vertex_groups:
            vg.remove([v.index])
        t = (Z_WAIST - v.co.z) / (Z_WAIST - Z_HEM)
        thigh = 0.15 + 0.85 * smoothstep(t / 0.45)  # mostly thigh-driven from the tunic hem down
        if v.co.z < Z_SLIT_TOP - 1e-6:
            # Below the slit top each half follows only its own thigh.
            is_left = v.co.x > 1e-5 or (abs(v.co.x) <= 1e-5 and v.index in LEFT_SLIT)
            wl = thigh if is_left else 0.0
        else:
            wl = thigh * max(0.0, min(1.0, 0.5 + v.co.x / (2 * blend)))
        wr = thigh - wl
        pelvis = 1.0 - thigh
        groups['pelvis'].add([v.index], pelvis, 'REPLACE')
        if wl > 0:
            groups['thigh_l'].add([v.index], wl, 'REPLACE')
        if wr > 0:
            groups['thigh_r'].add([v.index], wr, 'REPLACE')
    obj.parent = arm
    obj.matrix_parent_inverse = arm.matrix_world.inverted()
    obj.modifiers.new('Armature', 'ARMATURE').object = arm


LEFT_SLIT = set()


def main():
    tunic = bpy.data.objects[TUNIC]
    arm = bpy.data.objects['Armature']
    if arm.data.pose_position != 'REST':
        raise RuntimeError('put the Armature in REST position before authoring the apron')
    old = bpy.data.objects.get(APRON)
    if old is not None:
        bpy.data.meshes.remove(old.data)
    bvh, src_bm = evaluated_bvh([TUNIC, LEGS])
    grid = build_grid(bvh)
    smooth_skirt_depth(grid)
    bm = make_mesh(grid)
    add_strap(bm, bvh, grid)
    src_bm.free()
    me = bpy.data.meshes.new(APRON)
    bm.to_mesh(me)
    bm.free()
    # Middle-column originals (lower than the slit top) belong to the left half: they were created first.
    mid = COLS // 2
    LEFT_SLIT.clear()
    LEFT_SLIT.update(r * (COLS + 1) + mid for r, (_, z, _) in enumerate(grid) if z < Z_SLIT_TOP - 1e-6)
    me.materials.append(material())
    me.shade_smooth()
    obj = bpy.data.objects.new(APRON, me)
    bpy.data.collections[COLLECTION].objects.link(obj)
    weight(obj, tunic)
    me.calc_loop_triangles()
    print(f'{APRON}: {len(me.vertices)} verts, {len(me.loop_triangles)} tris, groups {len(obj.vertex_groups)}')


main()
