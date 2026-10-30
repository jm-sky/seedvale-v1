// Load original GLBs with the same Three revision and meshopt decoder as V1.
// Evaluate snapshots without a browser or WebGL renderer. No production writes.
import fs from 'node:fs';
import * as THREE from '/workspace/seedvale-v1/node_modules/three/build/three.module.js';
import { GLTFLoader } from '/workspace/seedvale-v1/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from '/workspace/seedvale-v1/node_modules/three/examples/jsm/libs/meshopt_decoder.module.js';
const out='/workspace/animal-audit';
const heights={sheep:0.68,wolf:0.95,cow:1.3,horse:1.55};
const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const all=[];
for (const name of Object.keys(heights)) {
  const file=fs.readFileSync(`/workspace/seedvale-v1/public/models/fauna/${name}.glb`);
  const gltf=await loader.parseAsync(file.buffer.slice(file.byteOffset,file.byteOffset+file.byteLength),'');
  const root=gltf.scene;root.updateMatrixWorld(true);
  // V1 prepareProp: height fit, ground and center (applied to the root).
  let box=new THREE.Box3().setFromObject(root);
  root.scale.multiplyScalar(heights[name]/box.getSize(new THREE.Vector3()).y);root.updateMatrixWorld(true);
  box.setFromObject(root);const center=box.getCenter(new THREE.Vector3());root.position.x-=center.x;root.position.z-=center.z;root.position.y-=box.min.y;root.updateMatrixWorld(true);box.setFromObject(root);
  const meshes=[];root.traverse(o=>{if(o.isMesh)meshes.push(o)});
  const mats=[...new Set(meshes.flatMap(m=>Array.isArray(m.material)?m.material:[m.material]))];
  const report={name,meshes:meshes.map(m=>({name:m.name,type:m.type,vertices:m.geometry.attributes.position.count,triangles:m.geometry.index.count/3,groups:m.geometry.groups,frustumCulled:m.frustumCulled,skinJoints:m.skeleton?.bones.length})),materials:mats.map(m=>({name:m.name,type:m.type,flatShading:m.flatShading,roughness:m.roughness,metalness:m.metalness,colorLinear:m.color.toArray(),side:m.side,map:!!m.map,normalMap:!!m.normalMap})),skeletonObjectsBeforeActorSharing:new Set(meshes.map(m=>m.skeleton)).size,height:heights[name],preparedBounds:[box.min.toArray(),box.max.toArray()],clips:gltf.animations.map(a=>({name:a.name,duration:a.duration,tracks:a.tracks.length})),snapshots:[],duplicateClipComparisons:[]};
  for (const a of gltf.animations) {
    if (a.name.includes('|')) continue;
    const b=gltf.animations.find(x=>x.name.endsWith('|'+a.name)); if(!b)continue;
    const tracksEqual=a.tracks.length===b.tracks.length&&a.tracks.every(t=>{const other=b.tracks.find(x=>x.name===t.name);return other&&Buffer.from(t.times.buffer,t.times.byteOffset,t.times.byteLength).equals(Buffer.from(other.times.buffer,other.times.byteOffset,other.times.byteLength))&&Buffer.from(t.values.buffer,t.values.byteOffset,t.values.byteLength).equals(Buffer.from(other.values.buffer,other.values.byteOffset,other.values.byteLength));});
    report.duplicateClipComparisons.push({bare:a.name,prefixed:b.name,tracksEqual,durationEqual:a.duration===b.duration});
  }
  function snapshot(label) {
    root.updateMatrixWorld(true);for(const m of meshes)m.skeleton?.update();
    const data={name,label,height:heights[name],materials:report.materials,meshes:[]};
    for(const m of meshes){
      const positions=[],normals=[];const p=new THREE.Vector3(),n=new THREE.Vector3(),v=new THREE.Vector3();
      const index=new THREE.Vector4(),weight=new THREE.Vector4(),bone=new THREE.Matrix4(),skin=new THREE.Matrix4();
      const normalMatrix=new THREE.Matrix3().getNormalMatrix(m.matrixWorld);
      for(let i=0;i<m.geometry.attributes.position.count;i++){
        m.getVertexPosition(i,p);p.applyMatrix4(m.matrixWorld);positions.push(...p.toArray());
        n.fromBufferAttribute(m.geometry.attributes.normal,i);
        if(m.isSkinnedMesh){
          index.fromBufferAttribute(m.geometry.attributes.skinIndex,i);weight.fromBufferAttribute(m.geometry.attributes.skinWeight,i);skin.elements.fill(0);
          for(let j=0;j<4;j++){
            bone.fromArray(m.skeleton.boneMatrices,index.getComponent(j)*16);
            for(let k=0;k<16;k++)skin.elements[k]+=bone.elements[k]*weight.getComponent(j);
          }
          skin.premultiply(m.bindMatrixInverse).multiply(m.bindMatrix);
          n.applyMatrix3(new THREE.Matrix3().setFromMatrix4(skin));
        }
        n.applyMatrix3(normalMatrix).normalize();normals.push(...n.toArray());
      }
      data.meshes.push({name:m.name,positions,normals,indices:Array.from(m.geometry.index.array),material:mats.indexOf(m.material)});
    }
    const dst=`${name}-${label}.snapshot.json`;fs.writeFileSync(`${out}/${dst}`,JSON.stringify(data));report.snapshots.push(dst);
  }
  snapshot('rest');
  for(const suffix of ['Idle','Walk','Gallop','Jump']){
    const clip=gltf.animations.find(a=>a.name.toLowerCase()===suffix.toLowerCase())??gltf.animations.find(a=>a.name.toLowerCase().endsWith('|'+suffix.toLowerCase()));
    if(!clip)continue;
    for(const phase of (suffix==='Walk'||suffix==='Jump'?[0,0.25,0.5,0.75]:[0.5])){
      const mixer=new THREE.AnimationMixer(root);const action=mixer.clipAction(clip);action.play();mixer.setTime(clip.duration*phase);snapshot(`${suffix.toLowerCase()}-${String(phase*100).padStart(2,'0')}`);mixer.stopAllAction();mixer.uncacheRoot(root);
    }
  }
  all.push(report);
}
fs.writeFileSync(`${out}/three-runtime-inspection.json`,JSON.stringify(all,null,2));
console.log(JSON.stringify(all.map(x=>({name:x.name,meshCount:x.meshes.length,materials:x.materials,skeletons:x.skeletonObjectsBeforeActorSharing,duplicateClips:x.duplicateClipComparisons,snapshots:x.snapshots})),null,2));
