/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'node:fs'
import { MeshoptDecoder } from '/workspace/seedvale-v1/node_modules/three/examples/jsm/libs/meshopt_decoder.module.js'
import { GLTFLoader } from '/workspace/seedvale-v1/node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { clone } from '/workspace/seedvale-v1/node_modules/three/examples/jsm/utils/SkeletonUtils.js'
import { shareActorSkeletons } from '/workspace/seedvale-v1/src/render/actorSkeletonSharing.ts'
import { applyNaturalMaterialResponseForUrl } from '/workspace/seedvale-v1/src/world/naturalMaterialResponse.ts'
const rows=[]
for(const name of ['sheep','wolf','cow','horse']){
 const url=`/models/fauna/${name}.glb`
 const buf=fs.readFileSync('/workspace/seedvale-v1/public'+url)
 const gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(buf.buffer.slice(buf.byteOffset,buf.byteOffset+buf.byteLength),'')
 applyNaturalMaterialResponseForUrl(url,gltf.scene)
 const actor=clone(gltf.scene)
 const result=shareActorSkeletons(actor)
 const mats:any[]=[]
 actor.traverse((o:any)=>{if(o.isMesh)mats.push({mesh:o.name,material:o.material.name,roughness:o.material.roughness,metalness:o.material.metalness,flatShading:o.material.flatShading,side:o.material.side})})
 rows.push({name,url,actorSkeletonSharing:result,materialsAfterProductionResponse:mats})
}
fs.writeFileSync('/workspace/animal-audit/runtime-lifecycle.json',JSON.stringify(rows,null,2))
console.log(JSON.stringify(rows,null,2))
