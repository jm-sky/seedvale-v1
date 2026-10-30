// Decode meshopt into temporary audit copies; production assets are read only.
import fs from 'node:fs';
import { MeshoptDecoder } from '/workspace/seedvale-v1/node_modules/meshoptimizer/meshopt_decoder.mjs';
await MeshoptDecoder.ready;
for (const name of ['sheep','wolf','cow','horse']) {
  const src=fs.readFileSync(`/workspace/seedvale-v1/public/models/fauna/${name}.glb`);
  const jl=src.readUInt32LE(12);
  const gltf=JSON.parse(src.toString('utf8',20,20+jl));
  const bin=src.subarray(28+jl);
  let offset=0; const parts=[];
  for (const view of gltf.bufferViews) {
    const ex=view.extensions?.EXT_meshopt_compression;
    let raw;
    if (ex) {
      raw=new Uint8Array(ex.count*ex.byteStride);
      MeshoptDecoder.decodeGltfBuffer(raw,ex.count,ex.byteStride,bin.subarray(ex.byteOffset??0,(ex.byteOffset??0)+ex.byteLength),ex.mode,ex.filter??'NONE');
      delete view.extensions.EXT_meshopt_compression;
      if (!Object.keys(view.extensions).length) delete view.extensions;
    } else raw=bin.subarray(view.byteOffset??0,(view.byteOffset??0)+view.byteLength);
    const padding=(4-raw.length%4)%4;
    view.buffer=0; view.byteOffset=offset; view.byteLength=raw.length;
    parts.push(Buffer.from(raw),Buffer.alloc(padding)); offset+=raw.length+padding;
  }
  gltf.buffers=[{byteLength:offset}];
  for (const key of ['extensionsUsed','extensionsRequired']) if(gltf[key]) gltf[key]=gltf[key].filter(x=>x!=='EXT_meshopt_compression');
  let json=Buffer.from(JSON.stringify(gltf));
  json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);
  const body=Buffer.concat(parts), head=Buffer.alloc(20), bh=Buffer.alloc(8);
  head.writeUInt32LE(0x46546c67,0);head.writeUInt32LE(2,4);head.writeUInt32LE(28+json.length+body.length,8);head.writeUInt32LE(json.length,12);head.writeUInt32LE(0x4e4f534a,16);
  bh.writeUInt32LE(body.length,0);bh.writeUInt32LE(0x004e4942,4);
  fs.writeFileSync(`/workspace/animal-audit/${name}.decoded.glb`,Buffer.concat([head,json,bh,body]));
  console.log(name,src.length,'->',28+json.length+body.length,'bytes');
}
