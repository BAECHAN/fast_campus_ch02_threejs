import "./style.css";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);

camera.position.z = 10;
camera.position.y = 5;
camera.position.x = -5;

/** 조명 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.castShadow  = true;
directionalLight.position.set(3,4,5);
directionalLight.lookAt(0,0,0);
scene.add(directionalLight);

/** 바닥 */
const floorGeometry = new THREE.PlaneGeometry(20,20);
const floorMaterial = new THREE.MeshStandardMaterial({color: 0xbbbbbb});
const floor = new THREE.Mesh(floorGeometry,floorMaterial);
floor.rotation.x = - Math.PI / 2 ; // x축을 기준으로 z축 방향으로( 내쪽으로 ) 90도만큼 회전
floor.receiveShadow = true;
floor.castShadow = true;
scene.add(floor);



/** 박스 */
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshStandardMaterial({color: 0xff0000});
const mesh = new THREE.Mesh(geometry,  material);
mesh.position.y = 0.5;
mesh.castShadow = true;
scene.add(mesh);

/** 캡슐 */
const capsuleGeometry = new THREE.CapsuleGeometry(1,2,20,30);
const capsuleMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00
});
const capsuleMesh = new THREE.Mesh(capsuleGeometry,capsuleMaterial);
capsuleMesh.position.set(3, 1.75, 0);
capsuleMesh.castShadow = true;
capsuleMesh.receiveShadow = true;

scene.add(capsuleMesh)

/** 원기둥 */
const cylinderGeometry = new THREE.CylinderGeometry(1,1,2);
const cylinderMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00
});
const cylinderMesh = new THREE.Mesh(cylinderGeometry,cylinderMaterial);
cylinderMesh.position.set(-3,1,0);
cylinderMesh.castShadow = true;
cylinderMesh.receiveShadow = true;
scene.add(cylinderMesh);

/** 도넛 */
const torusGeometry =  new THREE.TorusGeometry(0.5,0.1,16,100);
const torusMaterial = new THREE.MeshStandardMaterial({color: 0x0000ff});
const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
torusMesh.position.set(0,0.5,1);
torusMesh.castShadow = true;
torusMesh.receiveShadow = true;
scene.add(torusMesh);

/** Shape */
const starShape = new THREE.Shape();
starShape.moveTo(0,1);
starShape.lineTo(0.2, 0.2);
starShape.lineTo(1, 0.2);
starShape.lineTo(0.4, -0.1);
starShape.lineTo(0.6, -1);
starShape.lineTo(0, -0.5); 
starShape.lineTo(-0.6 , -1); 
starShape.lineTo(-0.4 , -0.1); 
starShape.lineTo(-1 , 0.2); 
starShape.lineTo(-0.2, 0.2); 

const shapeGeometry = new THREE.ShapeGeometry(starShape);
const shapeMaterial = new THREE.MeshStandardMaterial({color: 0xff00ff});
const shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
shapeMesh.position.set(0,1,2);
scene.add(shapeMesh);


/** extrude */
const extrudeSettings = {
  steps: 1,
  depth: 0.1,
  bevelEnabled: true,
  bevelThickness: 0.1,
  bevelSize: 0.3,
  bevelSegments: 100
}

const extrudeGeometry = new THREE.ExtrudeGeometry(starShape,  extrudeSettings);
const extrudeMaterial = new THREE.MeshStandardMaterial({color: 0x0ddaaf});
const extrudeMesh = new THREE.Mesh(extrudeGeometry,extrudeMaterial);
extrudeMesh.position.set(2,1.3,2);
extrudeMesh.castShadow = true;
extrudeMesh.receiveShadow = true;
scene.add(extrudeMesh);

/** Sphere 구 모양 */

const sphereGeometry = new THREE.SphereGeometry(1,32,32);
const sphereMaterial = new THREE.MeshStandardMaterial({color:  0x98daaf});
const sphereMesh = new THREE.Mesh(sphereGeometry,sphereMaterial);
sphereMesh.position.set(0,1,-3);
sphereMesh.castShadow = true;
sphereMesh.receiveShadow = true;
scene.add(sphereMesh);

/** points */
const numPoints = 1000;
const positions  = new Float32Array(numPoints * 3); 

for(let i=0;i<numPoints;i+=1){
  const x = (Math.random() - 0.5) * 1;
  const y = (Math.random() - 0.5) * 1;
  const z = (Math.random() - 0.5) * 1;

  positions[i*3] = x;
  positions[i*3 + 1] = y;
  positions[i*3 + 2] = z;
}

const bufferGeometry = new THREE.BufferGeometry();
bufferGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions,3)
);

const pointsMaterial =  new THREE.PointsMaterial({
  color: 0xffff00,
  size: 0.05
});

const point = new THREE.Points(bufferGeometry, pointsMaterial);
point.position.set(0,0,3);
scene.add(point);


/** 궤도 컨트롤 */
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.update();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene,camera);
})

const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();