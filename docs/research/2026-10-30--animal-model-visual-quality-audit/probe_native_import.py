"""Check native Blender import feasibility without exporting/saving anything."""
import bpy, json
from pathlib import Path
out=Path('/workspace/animal-audit'); rows=[]
for name in ['sheep','wolf','cow','horse']:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    try:
        bpy.ops.import_scene.gltf(filepath=str(out/f'{name}.decoded.glb'),import_shading='NORMALS')
        rows.append({'name':name,'result':'imported','objects':len(bpy.context.scene.objects),'armatures':[(o.name,len(o.data.bones)) for o in bpy.context.scene.objects if o.type=='ARMATURE']})
    except Exception as ex:
        rows.append({'name':name,'result':'failed','exception':str(ex)[-3500:]})
(out/'native-import-probe.json').write_text(json.dumps(rows,indent=2))
print('IMPORT_PROBE',json.dumps(rows))
