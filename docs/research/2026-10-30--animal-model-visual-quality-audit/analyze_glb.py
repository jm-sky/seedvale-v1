"""Read-only GLB audit. Writes evidence only into this audit directory."""
import hashlib, io, json, struct
from pathlib import Path
import numpy as np
from PIL import Image

OUT = Path(__file__).parent
ROOT = Path('/workspace/seedvale-v1')
DT = {5120: 'i1', 5121:'u1', 5122:'<i2', 5123:'<u2',5125:'<u4',5126:'<f4'}
SIZE = {'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}

def audit(name):
    path = ROOT / f'public/models/fauna/{name}.glb'
    original = path.read_bytes()
    data = (OUT / f'{name}.decoded.glb').read_bytes()
    magic, version, length = struct.unpack_from('<III',data)
    chunks = {}; pos=12
    while pos < len(data):
        size,kind=struct.unpack_from('<II',data,pos); pos+=8
        chunks[kind]=data[pos:pos+size]; pos+=size
    g=json.loads(chunks[0x4e4f534a]); binary=chunks.get(0x004e4942,b'')
    (OUT / f'{name}.gltf.json').write_text(json.dumps(g,indent=2))
    def acc(i):
        a=g['accessors'][i]; v=g['bufferViews'][a['bufferView']]
        dtype=np.dtype(DT[a['componentType']]); n=SIZE[a['type']]
        x=np.ndarray((a['count'],n),dtype=dtype,buffer=binary,offset=v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',dtype.itemsize*n),dtype.itemsize)).copy()
        if a.get('normalized') and a['componentType'] != 5126:
            lim=np.iinfo(dtype); x=x.astype(float)/lim.max
            if lim.min < 0: x=np.maximum(-1,x)
        return x
    primitives=[]; position_groups={}
    for mi,m in enumerate(g.get('meshes',[])):
        for pi,p in enumerate(m['primitives']):
            a=p['attributes']; xyz=acc(a['POSITION']).astype(float); ix=acc(p['indices']).ravel() if 'indices' in p else np.arange(len(xyz))
            ns=acc(a['NORMAL']) if 'NORMAL' in a else np.zeros_like(xyz)
            js=acc(a['JOINTS_0']) if 'JOINTS_0' in a else np.zeros((len(xyz),4))
            ws=acc(a['WEIGHTS_0']) if 'WEIGHTS_0' in a else np.zeros((len(xyz),4))
            for v,n,j,w in zip(xyz,ns,js,ws):
                signature=tuple(sorted((int(ji),round(float(wi),7)) for ji,wi in zip(j,w) if wi>0))
                position_groups.setdefault(tuple(v),[]).append((tuple(np.round(n,5)),signature))
            row={'mesh':mi,'mesh_name':m.get('name'),'primitive':pi,'mode':p.get('mode',4),'material':p.get('material'),'vertices':len(xyz),'indices':len(ix),'attributes':{k:{'count':g['accessors'][v]['count'],'type':g['accessors'][v]['type'],'componentType':g['accessors'][v]['componentType']} for k,v in a.items()},'morph_targets':len(p.get('targets',[])),'bounds':[xyz.min(axis=0).tolist(),xyz.max(axis=0).tolist()],'unique_positions_6dp':len(np.unique(np.round(xyz,6),axis=0))}
            if p.get('mode',4)==4:
                tris=ix.reshape(-1,3); row['triangles']=len(tris)
                cross=np.cross(xyz[tris[:,1]]-xyz[tris[:,0]],xyz[tris[:,2]]-xyz[tris[:,0]])
                area=np.linalg.norm(cross,axis=1); good=area>1e-10
                row['degenerate_triangles']=int((~good).sum())
                if 'NORMAL' in a:
                    normal=acc(a['NORMAL']); fn=cross[good]/area[good,None]; tn=normal[tris[good]]
                    unit_tn=tn/np.linalg.norm(tn,axis=2,keepdims=True)
                    row['triangle_corner_normals_identical_pct']=float((np.max(np.linalg.norm(unit_tn-unit_tn[:,0:1,:],axis=2),axis=1)<1e-5).mean()*100)
                    dot=np.clip(np.einsum('ijk,ik->ij',unit_tn,fn),-1,1)
                    row['normals']={'length_min':float(np.linalg.norm(normal,axis=1).min()),'length_max':float(np.linalg.norm(normal,axis=1).max()),'corners_within_1_degree_of_face_pct':float((dot>np.cos(np.deg2rad(1))).mean()*100),'triangles_all_corners_within_1_degree_pct':float((dot>np.cos(np.deg2rad(1))).all(axis=1).mean()*100),'corner_face_angle_mean_deg':float(np.rad2deg(np.arccos(dot)).mean()),'unique_normals_5dp':len(np.unique(np.round(normal,5),axis=0))}
            for key in ['TEXCOORD_0','COLOR_0','WEIGHTS_0','WEIGHTS_1']:
                if key in a:
                    x=acc(a[key]); row[key]={'min':x.min(axis=0).tolist(),'max':x.max(axis=0).tolist(),'unique_6dp':len(np.unique(np.round(x,6),axis=0))}
                    if key.startswith('WEIGHTS'):
                        row[key].update({'sum_min':float(x.sum(axis=1).min()),'sum_max':float(x.sum(axis=1).max()),'active_influences_max':int((x>0).sum(axis=1).max()),'active_influences_mean':float((x>0).sum(axis=1).mean())})
            primitives.append(row)
    images=[]
    for i,im in enumerate(g.get('images',[])):
        if 'bufferView' in im:
            v=g['bufferViews'][im['bufferView']]; b=binary[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']]
            pic=Image.open(io.BytesIO(b)); suffix={'PNG':'png','JPEG':'jpg'}.get(pic.format,'bin')
            dest=OUT/f'{name}-image-{i}.{suffix}'; dest.write_bytes(b)
            images.append({'index':i,'name':im.get('name'),'mimeType':im.get('mimeType'),'encoded_bytes':len(b),'resolution':list(pic.size),'mode':pic.mode,'rgba8_bytes_no_mips':pic.width*pic.height*4,'rgba8_bytes_with_mips_estimate':pic.width*pic.height*4*4/3,'unique_colors':len(pic.getcolors(pic.width*pic.height) or [])})
        else: images.append(im)
    animations=[]
    for an in g.get('animations',[]):
        inputs=[acc(s['input']).ravel() for s in an['samplers']]
        animations.append({'name':an.get('name'),'start':float(min(t.min() for t in inputs)),'end':float(max(t.max() for t in inputs)),'duration':float(max(t.max() for t in inputs)-min(t.min() for t in inputs)),'channels':len(an['channels']),'samplers':len(an['samplers']),'paths':sorted(set(c['target']['path'] for c in an['channels'])),'target_nodes':sorted(set(c['target']['node'] for c in an['channels'])),'interpolations':sorted(set(s.get('interpolation','LINEAR') for s in an['samplers'])),'key_counts':sorted(set(len(t) for t in inputs))})
    skins=[{'name':s.get('name'),'joints':len(s['joints']),'joint_names':[g['nodes'][j].get('name') for j in s['joints']],'skeleton':s.get('skeleton'),'inverse_bind_matrices':s.get('inverseBindMatrices')} for s in g.get('skins',[])]
    original_json=json.loads(original[20:20+struct.unpack_from('<I',original,12)[0]])
    sharing={'exact_unique_positions_across_primitives':len(position_groups),'positions_with_multiple_normals':sum(len(set(n for n,w in group))>1 for group in position_groups.values()),'positions_with_multiple_weight_signatures':sum(len(set(w for n,w in group))>1 for group in position_groups.values())}
    return {'name':name,'sha256':hashlib.sha256(original).hexdigest(),'file_bytes':len(original),'decoded_file_bytes':len(data),'declared_bytes':length,'version':version,'asset':g.get('asset'),'extensionsUsed':original_json.get('extensionsUsed',[]),'extensionsRequired':original_json.get('extensionsRequired',[]),'scene':g.get('scene',0),'scenes':g.get('scenes'),'nodes':g.get('nodes'),'primitives':primitives,'vertex_sharing':sharing,'materials':g.get('materials',[]),'textures':g.get('textures',[]),'samplers':g.get('samplers',[]),'images':images,'skins':skins,'animations':animations,'buffer_bytes':sum(b['byteLength'] for b in g.get('buffers',[]))}

if __name__=='__main__':
    result=[audit(n) for n in ['sheep','wolf','cow','horse']]
    (OUT/'measurements.json').write_text(json.dumps(result,indent=2))
    for x in result:
        small={k:v for k,v in x.items() if k not in ['nodes','scenes','animations','skins']}
        small['skins']=[{'name':s['name'],'joints':s['joints']} for s in x['skins']]
        small['animations']=[{k:v for k,v in a.items() if k not in ['target_nodes']} for a in x['animations']]
        print(json.dumps(small,indent=2))
