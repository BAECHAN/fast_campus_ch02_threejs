import "./style.css";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * 그림자 
 * 조명에 castShadow = true : 조명이 그림자 생성
 * 메쉬에 castShadow = true : 객체가 그림자 생성
 * 바닥에 receiveShadow = true : 바닥이 그림자를 받음
 * 
 * 기본적으로 그림자를 활성화하려면 line : 7과 같이 
 * renderer.shadowMap.enabled = true로 해야함
 * 
 * 그림자의 성능과 최적화
 * 
 * - 그림자는 계산 비용이 많이 들기 때문에 성능에 영향을 줄 수 있으므로,
 *   
 * 1) 필요한 곳에서만 그림자를 사용하고 불필요한 영역에 대한 그림자 계산을 줄여야함
 * 2) 그림자 맵의 해상도를 낮추어 성능을 최적화 하거나 할 수 있다.
 *    -> Light.shadow.mapSize.width와 height 속성을 통해 해상도를 조정
 *       width와 height가 높을수록 해상도가 높아짐
 * 
 * 
 */

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