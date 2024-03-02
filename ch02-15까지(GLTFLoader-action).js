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

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true; // 카메라 움직임에 관성 효과를 줌
orbitControls.dampingFactor = 0.03; // 관성의 정도를 정할 수 있음

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene,camera);
})


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

/**
 * 가져온 gltf객체의 action을 실행시킴
 */
const  animationClips = gltfAsync.animations;
const mixer = new THREE.AnimationMixer(characterAsync);
const action = mixer.clipAction(animationClips[3]); // 몇번째 액션을 실행시킬지 (파일안에 저장해둔게 있나봄)
action.setLoop(THREE.LoopRepeat); // 한번만 재생, 기본값은 LoopRepeat이며, LoopPingPong은 랜덤하게 재생

/**
 * paused
 * 
 * action을 정지시킴 
 * 주의 : clipAction메서드 안에있는 요소를 일치시켜야함
 * mixer.clipAction(animationClips[3])
 */
// setTimeout(()=>{
//   mixer.clipAction(animationClips[3]).paused = true; 
//  },3000);

/**
 * setDuration(sec)
 *  애니메이션을 5초 동안 재생하도록 조정합니다. 
 *  5초 동안 다 보여주려고하므로, 초가 줄어들면 더 빨라짐
 */
//action.setDuration(3); 

/**
 * setEffectiveTimeScale(sec)
 * 애니메이션의 재생속도 ( setDuration과 상호작용 )
 */
//action.setEffectiveTimeScale(2); // 재생속도

/**
 * 
 * 속도 조정 vs. 지속 시간 조정: 
 *  setEffectiveTimeScale은 애니메이션의 속도를 직접 조정하는 반면, 
 *  setDuration은 애니메이션이 특정 기간 내에 맞춰 재생되도록 전체 속도를 조정

 * 용도: 
    setEffectiveTimeScale은 애니메이션의 재생 속도를 동적으로 변경할 때 유용하며, 
    setDuration은 애니메이션이 특정 시간 안에 완료되어야 할 때 사용됩니다.
 */

/**
  * setEffectiveWeight
  * 
  * 애니메이션의 가중치를 주는데, 
  * 2개 이상의 동작을 할 때 가중치를 주어 복잡한 애니메이션을 처리하는데 유용
  * ex) 0.5정도로 주면 대충추는게 눈에 보임
*/
//action.setEffectiveWeight(0.5); 

action.play(); // 실행

const clock = new THREE.Clock();
const render = () => {
  requestAnimationFrame(render);
  orbitControls.update();
  renderer.render(scene, camera); 
  if(mixer){
    mixer.update(clock.getDelta()) // 믹서가 있을경우 update
  }
}

render();