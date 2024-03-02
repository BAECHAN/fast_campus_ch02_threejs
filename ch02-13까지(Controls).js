import "./style.css";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'


const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

// 그림자
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

/** 박스 */
const boxGeometry = new THREE.BoxGeometry(1,1,1);
const boxMaterial = new THREE.MeshStandardMaterial({color: 0xffff00});
const boxMesh = new THREE.Mesh(boxGeometry,  boxMaterial);
boxMesh.position.y = 0.5;
boxMesh.castShadow = true;
scene.add(boxMesh);


/** DirectionalLight ( 방향 조명 ) - 특정 방향에서 오는 빛 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.castShadow = true;
directionalLight.position.set(3,4,5);
directionalLight.lookAt(0,0,0);
//directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;


scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,1)
scene.add(directionalLightHelper)



/** OrbitControls 궤도 컨트롤 */
/**
 * 왼쪽,오른쪽 마우스키 동시에 누르고 움직이면 카메라 시점을 바꿀수있다
 */
const orbitControls = new OrbitControls(camera, renderer.domElement);
//orbitControls.enableDamping = true; // 카메라 움직임에 관성 효과를 줌
//orbitControls.dampingFactor = 0.03; // 관성의 정도를 정할 수 있음
//orbitControls.enableZoom = false; // 줌 사용불가 
//orbitControls.enablePan = true;
//orbitControls.autoRotate = true; // 자동으로 회전 처리
//orbitControls.autoRotateSpeed = 1; // 회전 속도
//orbitControls.enableRotate = false; // 카메라를 움직일 수 없음

//orbitControls.maxPolarAngle = Math.PI / 2; // 아래쪽으로 90도 안에서만 움직임
//orbitControls.minPolarAngle = Math.PI / 4; // 위쪽으로 45도 안에서만 움직임

/**maxAzimuthAngle과 minAzimuthAngle은 하나만 작성해선 안되고 둘다 작성해야
 * 시작과 끝이 정해져 정상 동작한다. 
 * */
//orbitControls.maxAzimuthAngle = Math.PI / 2;
//orbitControls.minAzimuthAngle = - Math.PI / 2;

/** Fly Controls */
// const flyControls = new FlyControls(camera, renderer.domElement);
// flyControls.movementSpeed = 1;
// flyControls.rollSpeed = Math.PI / 10;
// flyControls.autoForward = false;

// const firstPersonControls = new FirstPersonControls(camera,renderer.domElement);

// firstPersonControls.lookSpeed = 0.1;
// firstPersonControls.movementSpeed = 1;
// firstPersonControls.lookVertical = true; // 수직으로 시선이동 막으려면 false;


/** FPS처럼 1인칭 시점
 * 클릭 시 lock이 걸리면서 1인칭 시점으로 변경되며 풀려면 esc 버튼을 누른다.
 * render에 따로 update 메서드를 설정할 필요없다. ( 다른 컨트롤스랑 같이 쓰임 )
 */
// const pointerLockControls = new PointerLockControls(camera,renderer.domElement);
// window.addEventListener("click", () => {
//   pointerLockControls.lock();
// })


/**
 * 오르빗이랑 비슷한데 트랙볼을 조작하는 것처럼 카메라를 움직임
 */
const trackballControls = new TrackballControls(camera, renderer.domElement);

trackballControls.rotateSpeed = 2; 
trackballControls.zoomSpeed = 1.5;
trackballControls.panSpeed = 0.5;
trackballControls.noRotate = false; // 회전 허용 유무
trackballControls.noZoom = false;
trackballControls.noPan = false;
trackballControls.staticMoving = false;
trackballControls.dynamicDampingFactor = 0.05;

// 이해를 돕기 위해 트랙볼이 보이도록 해보면

const target = new THREE.Mesh(new THREE.SphereGeometry(0.5),  new THREE.MeshStandardMaterial({color: 0x0000ff}));
target.position.set(4,0.5,0);
scene.add(target);
trackballControls.target = target.position

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene,camera);
})

const clock = new THREE.Clock();
/** 마우스 드래그? 할때마다 자꾸 깜빡거려서 보니까 
 * update()함수를 먼저 실행하고 후에 render해야함 */
const render = () => {
  requestAnimationFrame(render);
  //orbitControls.update();
  //flyControls.update(clock.getDelta())
  //firstPersonControls.update(clock.getDelta())
  trackballControls.update();
  renderer.render(scene, camera); 
}

render();