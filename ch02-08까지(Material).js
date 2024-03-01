import "./style.css";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);

camera.position.x = 5;
camera.position.z =7 ;
camera.position.y = 5;

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

/** 앞면만 보이는 객체 */
const frontSideGeometry = new THREE.BoxGeometry(1,1,1);
const frontSideMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  side: THREE.FrontSide,
})

const frontSideMesh = new THREE.Mesh(frontSideGeometry,frontSideMaterial);

frontSideMesh.position.z = 4;
frontSideMesh.position.y = 0.5;

frontSideMesh.castShadow = true;
frontSideMesh.receiveShadow = true;

scene.add(frontSideMesh);

/** 뒷면만 보이는 객체 */
const backSideGeometry = new THREE.BoxGeometry(1,1,1);
const backSideMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  side: THREE.BackSide,
})

const backSideMesh = new THREE.Mesh(backSideGeometry,backSideMaterial);

backSideMesh.position.set(2,0.51,4); //y를 0.5로 주면 바닥과 동일하게 되어 충돌남 ( z-fighting 현상)
//backSideMesh.castShadow = true; // 더블 사이드 객체와 같은 이유가 발생해서 꺼둠
backSideMesh.receiveShadow = true;

scene.add(backSideMesh);

/** 더블 사이드 객체 */
const doubleSideGeometry = new THREE.BoxGeometry(1,1,1);
const doubleSideMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
})

const doubleSideMesh = new THREE.Mesh(doubleSideGeometry,doubleSideMaterial);

doubleSideMesh.position.set(4,0.51,4); //y를 0.5로 주면 바닥과 동일하게 되어 충돌남 ( z-fighting 현상)
doubleSideMesh.castShadow = true; // backSide도 마찬가지지만 castShadow = true 주게되면 뒷면이 그림자가 추가되어 객체가 울어버림
doubleSideMesh.receiveShadow = true;

scene.add(doubleSideMesh);

/**  토러스넛 스탠다드 매터리얼 */
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5,0.15,100,20);
const torusKnotStandMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000
})

torusKnotStandMaterial.roughness = 0.5;
torusKnotStandMaterial.metalness = 1;

const torusKnotStandardMesh = new THREE.Mesh(
  torusKnotGeometry,torusKnotStandMaterial
)

torusKnotStandardMesh.castShadow = true;
torusKnotStandardMesh.receiveShadow = true;
torusKnotStandardMesh.position.set(-4,1,0);

scene.add(torusKnotStandardMesh);

/**  토러스넛 램버트 매터리얼 */
const torusKnotLambertMaterial = new THREE.MeshLambertMaterial({
  color: 0xff0000
})

torusKnotLambertMaterial.emissive = new THREE.Color(0x00ff00);
torusKnotLambertMaterial.emissiveIntensity = 0.2;
const torusKnotLambertMesh = new THREE.Mesh(
  torusKnotGeometry,torusKnotLambertMaterial
)

torusKnotLambertMesh.castShadow = true;
torusKnotLambertMesh.receiveShadow = true;
torusKnotLambertMesh.position.set(-2,1,0);
scene.add(torusKnotLambertMesh)

/**  토러스넛 퐁 매터리얼 */
const torusKnotPhongMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000
})

torusKnotPhongMaterial.emissive = new THREE.Color(0x00ff00);
torusKnotPhongMaterial.emissiveIntensity = 0.2;
torusKnotPhongMaterial.specular = new THREE.Color(0x0000ff);
torusKnotPhongMaterial.shininess = 100;
const torusKnotPhongMesh = new THREE.Mesh(
  torusKnotGeometry,torusKnotPhongMaterial
)

torusKnotPhongMesh.castShadow = true;
torusKnotPhongMesh.receiveShadow = true;
torusKnotPhongMesh.position.set(0,1,0);
scene.add(torusKnotPhongMesh)

/**  토러스넛 베이직 매터리얼 */
const torusKnotBasicMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000
})

const torusKnotBasicMesh = new THREE.Mesh(
  torusKnotGeometry,torusKnotBasicMaterial
)

torusKnotBasicMesh.castShadow = true;
torusKnotBasicMesh.receiveShadow = true;
torusKnotBasicMesh.position.set(2,1,0);
scene.add(torusKnotBasicMesh);

/**  토러스넛 뎁스 매터리얼 */
const torusKnotDepthMaterial = new THREE.MeshDepthMaterial({
  color: 0xff0000
})

torusKnotDepthMaterial.opacity = 0.5;

const torusKnotDepthMesh = new THREE.Mesh(
  torusKnotGeometry,torusKnotDepthMaterial
)

torusKnotDepthMesh.castShadow = true;
torusKnotDepthMesh.receiveShadow = true;
torusKnotDepthMesh.position.set(4,1,0);
scene.add(torusKnotDepthMesh);


//텍스쳐로더 (동기적) - 이미지 삽입해서 객체로 만듦 
const textureLoader = new THREE.TextureLoader();
textureLoader.load("/threejs.webp", (texture) => {
  const textureBoxGeometry = new THREE.BoxGeometry(1,1,1);
  const textureMaterial = new THREE.MeshStandardMaterial({
    map: texture
  });

  const textureMesh = new THREE.Mesh(textureBoxGeometry,textureMaterial);
  textureMesh.castShadow = true;
  textureMesh.receiveShadow = true;
  textureMesh.position.set(0,0.5,2)
  scene.add(textureMesh);
})


/** 텍스쳐로더 (비동기적) - 이미지 삽입해서 객체로 만듦 */
const textureLoaderAsync = new THREE.TextureLoader();
const textureAsync = await textureLoaderAsync.loadAsync("/threejs.webp");

const textureAsyncBoxGeometry = new THREE.BoxGeometry(1,1,1);
const textureAsyncMaterial = new THREE.MeshStandardMaterial({
  map: textureAsync
});

const textureAsyncMesh = new THREE.Mesh(textureAsyncBoxGeometry,textureAsyncMaterial);
textureAsyncMesh.castShadow = true;
textureAsyncMesh.receiveShadow = true;
textureAsyncMesh.position.set(2,0.5,2)
scene.add(textureAsyncMesh);


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
  
  // mesh 회전시키기
  textureAsyncMesh.rotation.y += 0.01;
}

render();