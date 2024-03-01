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
const boxMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
const boxMesh = new THREE.Mesh(boxGeometry,  boxMaterial);
boxMesh.position.y = 0.5;
boxMesh.castShadow = true;
boxMesh.receiveShadow = true;
scene.add(boxMesh);


/** AmbientLight ( 전역 조명 ) - 균일하게 빛을 줌 ( 그림자 없음 ) */
const ambientLight = new THREE.AmbientLight(0xffffff, 5);
//scene.add(ambientLight)

/** DirectionalLight ( 방향 조명 ) - 특정 방향에서 오는 빛 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.castShadow = true;
directionalLight.position.set(3,4,5);
// scene.add(directionalLight)

/** DirectionalLightHelper
 *  개발자가 DirectionalLight의 방향과 범위를 시각적으로 확인할 수 있도록 도와주어, 
 *  조명이 씬(scene) 내에서 어떻게 작용하는지 이해하기 쉽게 만들어 줍니다. 
 *  특히, 조명의 방향 설정이 중요한 3D 그래픽 작업에서 유용하게 사용됩니다.
 */
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,1)
// scene.add(directionalLightHelper)

/** HemisphereLight ( 반구형 조명 ) - 
 * 반구형 조명은 하늘과 땅을 시뮬레이션 하여 상단과 하단에 서로 다른 색상을 적용할 수 있는 조명,
 * 이는 야외 장면에서 보다 자연스러운 조명 효과를 생성하는 데 사용
 * 참고. floor를 기준으로 위아래를 바꿔가며 화면을 확인해보면 이해하기 쉽다.
*/
const hemisphereLight = new THREE.HemisphereLight(0xb4a912, 0x12f34f, 5);
hemisphereLight.position.set(0,1,0);
//floorMaterial.side = THREE.DoubleSide; // 비교를 위해 바닥을 doubleSide로 임시 변경
//scene.add(hemisphereLight);


/** HemispheereLightHelper도 마찬가지 */
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight,1);
//scene.add(hemisphereLightHelper)

/** PointLight ( 점 조명 ) -
 * 점 조명은 특정 위치에서 모든 방향으로 빛을 발산합니다. 
 * 이는 전구나 촛불과 같은 광원을 시뮬레이션 할 때 사용됩니다. 
 * 점 조명은 그림자를 생성할 수 있으며, 
 * 광원으로부터의 거리에 따라 빛의 강도가 감소할 수 있습니다.
 * 
*/
const pointLight = new THREE.PointLight(0xffffff, 5, 5, 4); // 흰색, 빛의 강도, 최대거리, 거리에 따라 빛의 세기
pointLight.castShadow = true;
pointLight.position.set(1,1,1);
//scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight,1);
//scene.add(pointLightHelper);

/** RectAreaLight (사각형 영역 조명)
 * 사각형 영역 조명은 특정 사각형 영역에서 균일하게 빛을 발산하는 조명
 * 이는 창문이나 다른 사각형 광원을 통해 들어오는 빛을 시뮬레이션 하는 데 적합합니다. */

const rectAreaLight = new THREE.RectAreaLight(0xffffff,5,2,2);
rectAreaLight.position.set(0,1,2);
//scene.add(rectAreaLight)

/** SpotLight ( 스포트 조명 )
 *  특정 방향으로 광선을 집중시키는 광원입니다. 
 *  스포트라이트는 조절 가능한 각도와 범위를 가지고 있어, 
 *  무대 조명이나 손전등과 같은 효과를 만들 때 유용
 * 
 */
const spotLight = new THREE.SpotLight(0xffffff,10,100,Math.PI / 4, 1,1);
spotLight.castShadow = true;
spotLight.position.set(0,3,1);

/** SpotLight는 lookat 메서드로 적용할 수 없어 target을 설정해야한다. */
const spotLightTargetObj = new THREE.Object3D();
scene.add(spotLightTargetObj);
spotLight.target = spotLightTargetObj;
spotLight.target.position.set(1,-5,2)

scene.add(spotLight);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);





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