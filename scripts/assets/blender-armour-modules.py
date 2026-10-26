"""
Blender (dev-only, D-REN-8) — the armour modules that have no part in the CC0 Quaternius pack (render--012):
Chainmail, StuddedLeather, PaddedJacket (gambeson), LeatherCap. (Gloves are reused from blender-equipment-modules.py.)

Torso pieces: a Peasant tunic (male) / bodice + the upper part of the Peasant sleeves (female) in the Outfits rest pose,
decimated, with *re-projected UVs* onto a small tiling texture generated here (ring mesh / quilting / studs). The texture
does the material work, the geometry stays a plain tunic (the item reads from its colour and pattern, not from triangles).
Cap: a procedural skull dome with a rolled hem, one bone ('Head'), leather swatch of the Ranger atlas.
Output: assets-src/characters/eq/<Module>_<Sex>.raw.glb (65-bone UBC rig), same contract as blender-equipment-modules.py.

Run via Blender MCP: exec(open(r'<repo>/scripts/assets/blender-armour-modules.py').read()). Env SV_SEXES, SV_MODULES, SV_MODE
('build' default, 'all' = build + fit sheets, 'lib' = only helpers).
"""
import contextlib
import io
import os

_mode = os.environ.get('SV_MODE', 'build')
os.environ['SV_MODE'] = 'lib'
_ROOT = os.environ.get('SV_ROOT', r'D:\Projekty\private\SeedVales')
exec(compile(open(os.path.join(_ROOT, 'scripts', 'assets', 'blender-equipment-modules.py'), encoding='utf-8').read(), 'blender-equipment-modules.py', 'exec'), globals())
os.environ['SV_MODE'] = _mode

TORSO_TRIS = 1150
TEX_PX = 256


# ---------------------------------------------------------------- tiling textures (sRGB values, numpy)
def _grid(n):
    y, x = np.mgrid[0:n, 0:n].astype(np.float32)
    return x, y


def _smooth(a, lo, hi):
    t = np.clip((a - lo) / (hi - lo), 0, 1)
    return t * t * (3 - 2 * t)


def tex_mail(n=TEX_PX):
    """Two interleaved lattices of rings (period 16 px): light ring bodies with a top-left highlight on dark steel."""
    x, y = _grid(n)
    img = np.empty((n, n, 3), np.float32)
    img[:] = (0.10, 0.105, 0.115)
    for ox, oy in ((0, 0), (8, 8)):
        dx = ((x - ox + 8) % 16) - 8
        dy = ((y - oy + 8) % 16) - 8
        r = np.hypot(dx, dy)
        ring = _smooth(1.0 - np.abs(r - 6.0) / 1.9, 0.0, 0.6)
        lit = 0.55 + 0.45 * np.clip((-dx - dy) / (r * 1.414 + 1e-3), -1, 1)
        col = np.stack([0.40 + 0.42 * lit, 0.42 + 0.43 * lit, 0.46 + 0.44 * lit], axis=2)
        img = img * (1 - ring[..., None]) + col * ring[..., None]
    rng = np.random.default_rng(3)  # large-scale tarnish so the mail does not read as a flat print
    blot = np.kron(rng.random((n // 32, n // 32)), np.ones((32, 32))).astype(np.float32)
    return img * (0.9 + 0.2 * blot[..., None])


def tex_quilt(n=TEX_PX):
    """Linen with a diamond quilting: dark stitched seams, puffy lit cells (period 64 px)."""
    x, y = _grid(n)
    a, b = (x + y) % 64, (x - y) % 64
    d = np.minimum(np.minimum(a, 64 - a), np.minimum(b, 64 - b))
    puff = _smooth(d, 1.5, 20.0)
    seam = 1.0 - _smooth(d, 0.4, 1.8)
    rng = np.random.default_rng(7)
    noise = (rng.random((n, n)).astype(np.float32) - 0.5) * 0.05
    base = np.stack([0.80, 0.70, 0.52]) * (0.80 + 0.26 * puff[..., None]) + noise[..., None]
    return base * (1 - seam[..., None] * 0.8) + np.array([0.36, 0.27, 0.17]) * seam[..., None] * 0.8


def tex_studs(n=TEX_PX):
    """Dark, stiff leather with brass-grey studs (square grid every 32 px, alternate rows offset by 16)."""
    x, y = _grid(n)
    rng = np.random.default_rng(11)
    img = np.empty((n, n, 3), np.float32)
    leather = np.array([0.30, 0.17, 0.095], np.float32)
    img[:] = leather * (1 + (rng.random((n, n, 1)).astype(np.float32) - 0.5) * 0.25)
    row = (y // 16).astype(int)
    xs = x + np.where(row % 2 == 0, 0, 8)
    dx = (xs % 16) - 8
    dy = (y % 16) - 8
    r = np.hypot(dx, dy)
    ring = 1.0 - _smooth(r, 3.2, 4.6)       # dark socket
    stud = 1.0 - _smooth(r, 2.0, 3.0)
    lit = np.clip(0.6 + (-dx - dy) / 6.0, 0.25, 1.0)
    col = np.stack([0.50 * lit + 0.25, 0.47 * lit + 0.25, 0.42 * lit + 0.25], axis=2)
    img = img * (1 - ring[..., None] * 0.7)
    return img * (1 - stud[..., None]) + col * stud[..., None]


def tex_material(name, arr):
    """Packed base-colour-only material from an sRGB array (cached per name)."""
    cache = bpy.app.driver_namespace.setdefault('sv_mats', {})
    if name in cache and cache[name].name in bpy.data.materials:
        return cache[name]
    n = arr.shape[0]
    img = bpy.data.images.new(name, n, n, alpha=False)
    img.colorspace_settings.name = 'sRGB'
    rgba = np.concatenate([np.clip(arr, 0, 1), np.ones((n, n, 1), np.float32)], axis=2).astype(np.float32)
    img.pixels.foreach_set(rgba.ravel())
    img.pack()
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = principled(mat)
    tex = mat.node_tree.nodes.new('ShaderNodeTexImage')
    tex.image = img
    mat.node_tree.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
    bsdf.inputs['Metallic'].default_value = 0.0
    bsdf.inputs['Roughness'].default_value = 1.0
    cache[name] = mat
    return mat


def project_uv(obj, tile):
    """Box projection per face (dominant normal axis), `tile` metres per texture repeat; one UV layer."""
    me = obj.data
    while len(me.uv_layers) > 1:
        me.uv_layers.remove(me.uv_layers[-1])
    layer = me.uv_layers.active or me.uv_layers.new(name='UVMap')
    for p in me.polygons:
        nx, ny, nz = (abs(c) for c in p.normal)
        for li in p.loop_indices:
            co = me.vertices[me.loops[li].vertex_index].co
            u, v = (co.x, co.z) if ny >= nx and ny >= nz else ((co.y, co.z) if nx >= nz else (co.x, co.y))
            layer.data[li].uv = (u / tile, v / tile)


# ---------------------------------------------------------------- torso pieces
def join(objs):
    first = objs[0]
    with bpy.context.temp_override(object=first, active_object=first, selected_editable_objects=objs, selected_objects=objs):
        bpy.ops.object.join()
    return first


def torso_base(o, sex, sleeve_cut, name):
    """Tunic (male) / bodice + upper sleeves (female) as one evaluated mesh, weights kept, sleeves ending at |x| = sleeve_cut."""
    body = evaluated_copy(part(o, sex, 'Peasant_Body'), name)
    if sex == 'Female':
        arms = evaluated_copy(part(o, sex, 'Peasant_Arms'), name + '_a')
        sl = extract(arms, lambda i, co: 0.10 < abs(co.x) <= sleeve_cut, name + '_s')
        bpy.data.objects.remove(arms)
        body = join([body, sl])
    else:
        short = extract(body, lambda i, co: abs(co.x) <= sleeve_cut, name + '_c')
        bpy.data.objects.remove(body)
        body = short
    body.name = name
    return body


def smooth(obj):
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    for f in bm.faces:
        f.smooth = True
    bm.to_mesh(obj.data)
    bm.free()


def relax(obj, iters=6, factor=0.5):
    """Laplacian-relax interior vertices only (hem/neck/sleeve borders stay put): removes the lumps decimation leaves
    where the tunic's placket, buttons and belt loops were."""
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    inner = [v for v in bm.verts if not any(e.is_boundary for e in v.link_edges)]
    for _ in range(iters):
        bmesh.ops.smooth_vert(bm, verts=inner, factor=factor, use_axis_x=True, use_axis_y=True, use_axis_z=True)
    bm.to_mesh(obj.data)
    bm.free()
    obj.data.update()


def build_torso(o, sex, key):
    spec = {  # sleeve end (|x| m), texture, tile (m per repeat)
        'Chainmail': (0.32 if sex == 'Male' else 0.30, tex_mail, 0.30),
        'PaddedJacket': (0.40, tex_quilt, 0.45),
        'StuddedLeather': (0.36 if sex == 'Male' else 0.34, tex_studs, 0.40),
    }[key]
    cut, tex, tile = spec
    obj = torso_base(o, sex, cut, key)
    decimate_to(obj, TORSO_TRIS)
    relax(obj)
    project_uv(obj, tile)
    obj.data.materials.clear()
    obj.data.materials.append(tex_material('SV_' + key, tex()))
    for p in obj.data.polygons:
        p.material_index = 0
    smooth(obj)
    return [obj]


# ---------------------------------------------------------------- leather cap
def tex_cap(n=TEX_PX):
    """Stitched leather: four dome panels (u) with dark seams + stitch dashes, a darker hem band (v < 0.22), grain noise."""
    x, y = _grid(n)
    rng = np.random.default_rng(5)
    grain = 1 + (rng.random((n, n)).astype(np.float32) - 0.5) * 0.22
    img = np.empty((n, n, 3), np.float32)
    img[:] = np.array([0.34, 0.20, 0.11], np.float32)
    img *= grain[..., None]
    pan = n / 4
    d = np.abs(((x + pan / 2) % pan) - pan / 2)           # distance to the nearest seam column
    seam = 1.0 - _smooth(d, 1.0, 3.2)
    stitch = (1.0 - _smooth(np.abs(d - 5.0), 0.5, 1.6)) * (((y // 5) % 2) == 0)
    band = _smooth(y, 0.22 * n - 2, 0.22 * n + 2)          # 0 = hem band (rows near v=0)
    img = img * (0.62 + 0.38 * band[..., None])
    img = img * (1 - seam[..., None] * 0.4) + np.array([0.60, 0.48, 0.32]) * stitch[..., None] * 0.3
    return img


def build_cap(o, sex, leather_uv, arm):
    dz = 0.0 if sex == 'Male' else -0.043          # the female head sits 4.3 cm lower (head bone z 1.60 / 1.55)
    cx, cy, cz = 0.0, -0.004, 1.70 + dz
    rx, ry, rz = 0.096, 0.114, 0.121
    if sex == 'Female':  # the female skull/hair reaches further back and up: first dome poked through at the crown
        cy, rx, ry, rz = 0.002, 0.098, 0.121, 0.127
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=24, v_segments=10, radius=1.0)
    for v in bm.verts:
        v.co = (cx + v.co.x * rx, cy + v.co.y * ry, cz + v.co.z * rz)
    # cut plane: brow level at the front (y = -0.11), 8 cm lower at the back so the cap covers the ears' top and the nape
    plane_co = mathutils.Vector((0, -0.11, 1.742 + dz))
    plane_no = mathutils.Vector((0, 0.38, 1.0)).normalized()
    bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], dist=1e-5, plane_co=plane_co, plane_no=plane_no,
                           clear_inner=True, clear_outer=False)
    border = [e for e in bm.edges if e.is_boundary]
    res = bmesh.ops.extrude_edge_only(bm, edges=border)
    for v in [g for g in res['geom'] if isinstance(g, bmesh.types.BMVert)]:  # rolled hem: slightly out and 1.2 cm down
        v.co.x = cx + (v.co.x - cx) * 1.035
        v.co.y = cy + (v.co.y - cy) * 1.035
        v.co.z -= 0.012
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    for f in bm.faces:
        f.smooth = True
    uvl = bm.loops.layers.uv.new('UVMap')
    zlo, zhi = min(v.co.z for v in bm.verts), cz + rz
    for f in bm.faces:
        u0 = None
        for l in f.loops:
            co = l.vert.co
            u = (math.atan2(co.y - cy, co.x - cx) / (2 * math.pi)) % 1.0
            if u0 is None:
                u0 = u
            u += round(u0 - u)                       # keep a face on one side of the wrap (REPEAT sampler tiles it)
            l[uvl].uv = (u, (co.z - zlo) / (zhi - zlo))
    me = bpy.data.meshes.new('LeatherCap')
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new('LeatherCap', me)
    bpy.context.scene.collection.objects.link(ob)
    vg = ob.vertex_groups.new(name='Head')
    vg.add(list(range(len(me.vertices))), 1.0, 'REPLACE')
    ob.parent = arm
    ob.modifiers.new('Armature', 'ARMATURE').object = arm
    me.materials.append(tex_material('SV_LeatherCap', tex_cap()))
    return [ob]


def build_all(sexes, only=None):
    report = {}
    for sex in sexes:
        with contextlib.redirect_stdout(io.StringIO()):
            o = load_all(sex)
        arm = o['Armature']
        rbody = part(o, sex, 'Ranger_Body')
        small_material(rbody.material_slots[0].material, 'SV_MI_Ranger')
        leather_uv = brown_uv(rbody, bpy.data.materials['SV_MI_Ranger'])
        for key in ('Chainmail', 'StuddedLeather', 'PaddedJacket', 'LeatherCap'):
            if only and key not in only:
                continue
            objs = build_cap(o, sex, leather_uv, arm) if key == 'LeatherCap' else build_torso(o, sex, key)
            path = os.path.join(OUT, f'{key}_{sex}.raw.glb')
            tris = export_module(path, objs, arm)
            mn, mx = bounds(objs)
            report[f'{key}_{sex}'] = dict(tris=tris, size_kb=os.path.getsize(path) // 1024,
                                          bbox=[[round(x, 3) for x in mn], [round(x, 3) for x in mx]])
            print(f'{key}_{sex}: {tris} tris, {report[f"{key}_{sex}"]["size_kb"]} KB, bbox {report[f"{key}_{sex}"]["bbox"]}')
        end()
    return report


if _mode in ('build', 'all'):
    _sexes = os.environ.get('SV_SEXES', 'Male,Female').split(',')
    _only = os.environ.get('SV_MODULES', '').split(',') if os.environ.get('SV_MODULES') else None
    try:
        _rep = build_all(_sexes, _only)
    finally:
        end()
