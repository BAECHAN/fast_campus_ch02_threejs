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
floor.name = "FLOOR";
scene.add(floor);

/** DirectionalLight ( 방향 조명 ) - 특정 방향에서 오는 빛 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.castShadow = true;
directionalLight.position.set(3,4,5);
directionalLight.lookAt(0,0,0);
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;

scene.add(directionalLight);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true; // 카메라 움직임에 관성 효과를 줌
orbitControls.dampingFactor = 0.03; // 관성의 정도를 정할 수 있음

/**
 * 막간 꿀팁 3d화면에서는 0,0은 정중앙, -1,1은 왼쪽상단(10시 방향), 1,-1은 오른쪽하단(4시 방향) 임
 */
const newPosition = new THREE.Vector3(0,1,0);
const rayCaster = new THREE.Raycaster();

/** pointerdown은 최신브라우저에서 지원하며,
 mousedown과 달리 마우스 뿐만아니라 터치스크린, 펜 등 다양한 입력장치를 포괄함 */
renderer.domElement.addEventListener("pointerdown", (e) => { 
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -((e.clientY / window.innerHeight) * 2 - 1);

  rayCaster.setFromCamera(new THREE.Vector2(x,y), camera);
  const intersects = rayCaster.intersectObjects(scene.children);
  console.log("intersects", intersects);

  const intersectFloor = intersects.find((i) => i.object.name === "FLOOR");
  console.log("intersectFloor", intersectFloor);
  newPosition.copy(intersectFloor.point);
  newPosition.y = 1;
})

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene,camera);
})


/** GLTF 비동기적 */
const gltfLoader = new GLTFLoader();
const gltf = await gltfLoader.loadAsync("/dancer.glb");
const character = gltf.scene;
character.position.y = 0.8;
character.scale.set(0.01,0.01,0.01);

/** 객체에 그림자가 적용이 되지 않을 것이기 때문에 아래와 같은 코드를 추가한다. */
character.castShadow = true;
character.receiveShadow = true;

character.traverse((obj) => {
  if(obj.isMesh){
    obj.castShadow = true;
    obj.receiveShadow = true;
  }
})
scene.add(character);

/**
 * 가져온 gltf객체의 action을 실행시킴
 */
const  animationClips = gltf.animations;
const mixer = new THREE.AnimationMixer(character);
const action = mixer.clipAction(animationClips[3]); 
action.setLoop(THREE.LoopPingPong); 

const clock = new THREE.Clock();
const targetVector = new THREE.Vector3();

const render = () => {
  character.lookAt(newPosition); // 캐릭터가 pointdown이 발생할때마다 시선을 바라보도록 처리
  targetVector.subVectors(newPosition, character.position).normalize().multiplyScalar(0.01);

  /**
   * 애니메이션을 멈추면서 포인트를 누른 방향으로 이동함
   */
  if(Math.abs(character.position.x - newPosition.x) >= 1 || 
    Math.abs(character.position.z - newPosition.z) >= 1){
    character.position.x += targetVector.x;
    character.position.z += targetVector.z;
    action.stop();
  }
  action.play(); // 실행

  renderer.render(scene, camera); 
  requestAnimationFrame(render);
  orbitControls.update();
  if(mixer){
    mixer.update(clock.getDelta()) // 믹서가 있을경우 update
  }
}

render();