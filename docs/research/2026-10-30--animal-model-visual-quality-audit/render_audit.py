"""Render Three.js-evaluated baseline snapshots in a fixed Blender studio.
No normals/material corrections, model export, or .blend save is performed.
"""
import bpy, json, math, sys
from pathlib import Path
from mathutils import Vector
OUT=Path('/workspace/animal-audit')
names=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else ['sheep','wolf','cow','horse']
metadata={}
def aim(obj,point): obj.rotation_euler=(Vector(point)-obj.location).to_track_quat('-Z','Y').to_euler()
def converted(flat): return [(flat[i],-flat[i+2],flat[i+1]) for i in range(0,len(flat),3)]

for name in names:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    baseline=json.loads((OUT/f'{name}-rest.snapshot.json').read_text())
    pts=[v for m in baseline['meshes'] for v in converted(m['positions'])]
    lo=Vector([min(v[i] for v in pts) for i in range(3)]);hi=Vector([max(v[i] for v in pts) for i in range(3)])
    scale=1.5/(hi.z-lo.z);offset=Vector((-(lo.x+hi.x)*0.5,-(lo.y+hi.y)*0.5,-lo.z))*scale
    mesh_objects=[];materials=[]
    for m in baseline['materials']:
        mat=bpy.data.materials.new(m['name']);mat.use_nodes=True;bsdf=mat.node_tree.nodes['Principled BSDF']
        bsdf.inputs['Base Color'].default_value=(*m['colorLinear'],1);bsdf.inputs['Metallic'].default_value=m['metalness'];bsdf.inputs['Roughness'].default_value=m['roughness'];materials.append(mat)
    for m in baseline['meshes']:
        mesh=bpy.data.meshes.new(m['name']);xyz=[Vector(v)*scale+offset for v in converted(m['positions'])];idx=m['indices'];mesh.from_pydata(xyz,[],[idx[i:i+3] for i in range(0,len(idx),3)]);mesh.update()
        for p in mesh.polygons:p.use_smooth=True
        mesh.normals_split_custom_set_from_vertices(converted(m['normals']))
        obj=bpy.data.objects.new(m['name'],mesh);bpy.context.scene.collection.objects.link(obj);obj.data.materials.append(materials[m['material']]);mesh_objects.append(obj)
    scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=12;scene.cycles.use_denoising=False
    scene.render.resolution_x=640;scene.render.resolution_y=512;scene.render.resolution_percentage=100
    scene.render.image_settings.file_format='PNG';scene.render.film_transparent=False
    scene.view_settings.view_transform='Standard';scene.view_settings.look='Medium High Contrast';scene.view_settings.exposure=0;scene.view_settings.gamma=1
    world=bpy.data.worlds.new('Audit neutral world');world.use_nodes=True;world.node_tree.nodes['Background'].inputs['Color'].default_value=(0.45,0.45,0.45,1);world.node_tree.nodes['Background'].inputs['Strength'].default_value=0.5;scene.world=world
    bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-0.012));ground=bpy.context.object
    mat=bpy.data.materials.new('Audit ground');mat.use_nodes=True;mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(0.18,0.18,0.18,1);mat.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=1;ground.data.materials.append(mat)
    bpy.ops.object.light_add(type='SUN',location=(4,-6,8));sun=bpy.context.object;sun.data.energy=2;sun.data.angle=math.radians(10);aim(sun,(0,0,0))
    bpy.ops.object.light_add(type='AREA',location=(-4,-6,7));light=bpy.context.object;light.data.energy=500;light.data.shape='DISK';light.data.size=6;aim(light,(0,0,0.7))
    bpy.ops.object.camera_add();camera=bpy.context.object;camera.data.type='ORTHO';camera.data.ortho_scale=max((hi.y-lo.y)*scale,(hi.x-lo.x)*scale,1.5)*1.4;scene.camera=camera
    target=Vector((0,0,0.75))
    metadata[name]={'source':'original GLB decoded and posed by Three.js r185.1; static snapshot reconstructed with original per-vertex normals and PBR scalars','blender_version':bpy.app.version_string,'samples':12,'original_prepared_world_bounds':[list(lo),list(hi)],'render_scale':scale,'camera_ortho_scale':camera.data.ortho_scale,'images':[]}
    for view,direction in [('threequarter',(4,-6,2.4)),('side',(6,0,1.0)),('rear',(-4,6,2.4))]:
        camera.location=target+Vector(direction);aim(camera,target);dst=f'{name}-{view}.png';scene.render.filepath=str(OUT/dst);bpy.ops.render.render(write_still=True);metadata[name]['images'].append(dst)
    camera.location=target+Vector((4,-6,2.4));aim(camera,target)
    for path in sorted(OUT.glob(f'{name}-*.snapshot.json')):
        if path.name.endswith('-rest.snapshot.json'):continue
        shot=json.loads(path.read_text())
        for obj,m in zip(mesh_objects,shot['meshes']):
            xyz=[Vector(v)*scale+offset for v in converted(m['positions'])]
            for v,co in zip(obj.data.vertices,xyz):v.co=co
            obj.data.update();obj.data.normals_split_custom_set_from_vertices(converted(m['normals']))
        dst=f'{name}-{shot["label"]}.png';scene.render.filepath=str(OUT/dst);bpy.ops.render.render(write_still=True);metadata[name]['images'].append(dst)
    (OUT/f'{name}-render-metadata.json').write_text(json.dumps(metadata[name],indent=2));print('AUDIT_COMPLETE',name,flush=True)
