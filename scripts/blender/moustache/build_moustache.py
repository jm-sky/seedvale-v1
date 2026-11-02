"""
HAIR_Moustache source (Blender 5.x). Chevron / woodcutter style: dense, widest in the middle, tapering and drooping to
the mouth corners, ragged upper edge, lower edge half covering the upper lip, slightly asymmetric.

Input : HEAD_JSON  - rest-pose world vertices of Male_Head.glb (glTF frame, metres), produced by
                     `node scripts/assets/moustache-dump-head.mjs` (see docs/assets/MODELS.md, HAIR_Moustache).
Output: OUT_DIR/moustache.glb (+Y up, no skin; scripts/assets/add-moustache.mjs skins it to the Head bone and merges it
        into hair*.glb) and OUT_DIR/moustache.blend.
Every vertex is placed by raycasting onto the head surface and offset along the surface normal, so the shell hugs the
face; the outline rows sink 2 mm into the skin so no gap is visible. ~100 triangles, UVs inside the beard's atlas patch.
Run inside Blender:  HEAD_JSON=...; OUT_DIR=...; exec(open('scripts/blender/moustache/build_moustache.py').read())
"""
import bpy, bmesh, json, math, os
from mathutils import Vector
from mathutils.bvhtree import BVHTree

HEAD_JSON = globals().get('HEAD_JSON')
OUT_DIR = globals().get('OUT_DIR')
d = json.load(open(HEAD_JSON))
G2B = lambda p: Vector((p[0], -p[2], p[1]))  # glTF (x, y up, z fwd) -> Blender (x, -z, y)

for me in list(bpy.data.meshes):
    bpy.data.meshes.remove(me)
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
hv = [G2B(p) for p in d['v']]
tris = [tuple(d['i'][k:k + 3]) for k in range(0, len(d['i']), 3)]
bvh = BVHTree.FromPolygons(hv, tris)
hm = bpy.data.meshes.new('HeadRef'); hm.from_pydata([tuple(v) for v in hv], [], tris); hm.update()
head = bpy.data.objects.new('HeadRef', hm); bpy.context.scene.collection.objects.link(head)

def surf(x, z):
    hit, n, _, _ = bvh.ray_cast(Vector((x, -1.0, z)), Vector((0, 1, 0)))
    return hit, n

N = 21
U = [(-1 + 2 * i / (N - 1)) for i in range(N)]
def wob(i, k):  # deterministic ragged jitter in [-1, 1]
    return math.sin(i * 12.9898 + k * 78.233) * 0.5 + math.sin(i * 3.7 + k * 1.3) * 0.5

verts, uvs = [], []
rows = 4
for i, u in enumerate(U):
    a = abs(u)
    side = 1 if u >= 0 else -1
    asym = 1.0 + (0.05 if side > 0 else -0.03)               # natural, slightly lopsided
    x = u * 0.042 * asym
    cy = 1.638 - 0.016 * a ** 1.3 - (0.002 if side > 0 else 0)  # chevron: peak in the middle, ends droop
    h = 0.0110 * (1 - a ** 1.5) + 0.0035                     # tall in the middle, thin at the corners
    top = cy + h * 0.62 + 0.0016 * wob(i, 1)                   # ragged upper edge
    bot = cy - h * 0.62 + 0.0040 * wob(i, 2) * (0.4 + a) - (0.0025 * (1 - 0.5 * a) if i % 2 else 0)     # tufty lower edge, lower than the lip line
    ys = [top, top - (top - bot) * 0.30, top - (top - bot) * 0.68, bot]
    fade = 1 - 0.55 * a * a
    offs = [-0.0022, 0.0120 * fade, 0.0140 * fade + 0.0010 * wob(i, 3), 0.0055 * fade + 0.0022 * wob(i, 4) - 0.0004]
    if a > 0.92: offs[3] = -0.0010                              # corner tips sink into the skin
    for r in range(rows):
        hit, n = surf(x, ys[r])
        if hit is None:
            hit, n = Vector((x, -0.09, ys[r])), Vector((0, -1, 0))
        verts.append(hit + n.normalized() * offs[r])
        uvs.append((0.55 + 0.10 * (u * 0.5 + 0.5), 0.29 + 0.12 * (1 - r / (rows - 1))))

faces = []
for i in range(N - 1):
    for r in range(rows - 1):
        a, b, c, e = i * rows + r, (i + 1) * rows + r, (i + 1) * rows + r + 1, i * rows + r + 1
        faces.append((a, e, c, b))  # CCW seen from the front (-Y)
mesh = bpy.data.meshes.new('HAIR_Moustache')
mesh.from_pydata([tuple(v) for v in verts], [], faces); mesh.update()
uvl = mesh.uv_layers.new(name='UVMap')
for poly in mesh.polygons:
    for li in poly.loop_indices:
        uvl.data[li].uv = uvs[mesh.loops[li].vertex_index]
for p in mesh.polygons: p.use_smooth = True
obj = bpy.data.objects.new('HAIR_Moustache', mesh); bpy.context.scene.collection.objects.link(obj)
# keep the face normals pointing away from the head; flip if the first face looks inward
bpy.context.view_layer.objects.active = obj
bm = bmesh.new(); bm.from_mesh(mesh); bmesh.ops.triangulate(bm, faces=bm.faces[:]); 
bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
if sum(f.normal.y for f in bm.faces) > 0: bmesh.ops.reverse_faces(bm, faces=bm.faces[:])
bm.to_mesh(mesh); bm.free()
mat = bpy.data.materials.new('MI_Hair_1'); mat.use_nodes = True
mesh.materials.append(mat)
head.hide_render = True
os.makedirs(OUT_DIR, exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT_DIR, 'moustache.blend'))
for o in bpy.data.objects: o.select_set(o == obj)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT_DIR, 'moustache.glb'), use_selection=True, export_format='GLB',
                          export_yup=True, export_apply=True, export_materials='NONE', export_normals=True)
print('moustache tris', len(mesh.polygons))
