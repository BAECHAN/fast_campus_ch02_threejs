import "./style.css";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);


renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 성능이 제일 좋은 그림자

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);

camera.position.x = 5;
camera.position.z = 7 ;
camera.position.y = 5;

/** 바닥 */
const floorGeometry = new THREE.PlaneGeometry(20,20);
const floorMaterial = new THREE.MeshStandardMaterial(
  {
    color: 0xbbbbbb,
  }
);

const floor = new THREE.Mesh(floorGeometry,floorMaterial);
floor.rotation.x = - Math.PI / 2 ; // x축을 기준으로 z축 방향으로( 내쪽으로 ) 90도만큼 회전
floor.receiveShadow = true;
floor.castShadow = true;
scene.add(floor);

/** DirectionalLight ( 방향 조명 ) - 특정 방향에서 오는 빛 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.castShadow = true;
directionalLight.position.set(3,4,5);
directionalLight.lookAt(0,0,0);
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;

scene.add(directionalLight);

/** GLTF 동기적 */
// const gltfLoader = new GLTFLoader();
// gltfLoader.load("/dancer.glb", (gltf) => {
//   const character = gltf.scene;
//   character.position.y = 0.8;
//   character.scale.set(0.01,0.01,0.01);

//   scene.add(character);
// })

/** GLTF 비동기적 */
const gltfLoaderAsync = new GLTFLoader();
const gltfAsync = await gltfLoaderAsync.loadAsync("/dancer.glb");
const characterAsync = gltfAsync.scene;
characterAsync.position.y = 0.8;
characterAsync.scale.set(0.01,0.01,0.01);

/** 객체에 그림자가 적용이 되지 않을 것이기 때문에 아래와 같은 코드를 추가한다. */
characterAsync.castShadow = true;
characterAsync.receiveShadow = true;

/** 위의 코드로만 하면 그림자가 보이지 않는데 
 * 그 이유는 객체 자체의 그림자를 추가했지만 
 * 객체를 구성하는 요소 하나하나에도 그림자를 적용해야 되기 때문에
 * traverse 메서드를 통해 children을 하나씩 타고 내려가면서 그림자를 추가한다. 
 * 
 * 궁금하면 콘솔로그 확인해서 children 확인 ㄱ
 * */
console.log(gltfAsync)

characterAsync.traverse((obj) => {
  if(obj.isMesh){
    obj.castShadow = true;
    obj.receiveShadow = true;
  }
})
scene.add(characterAsync);



const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true; // 카메라 움직임에 관성 효과를 줌
orbitControls.dampingFactor = 0.03; // 관성의 정도를 정할 수 있음

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene,camera);
})

const clock = new THREE.Clock();
const render = () => {
  requestAnimationFrame(render);
  orbitControls.update();
  renderer.render(scene, camera); 
}

render();