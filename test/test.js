import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById('myCanvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

// カメラコントローラーを作成
const controls = new OrbitControls(camera, canvas);
// 滑らかにカメラコントローラーを制御する
controls.enableDamping = true;
controls.dampingFactor = 0.2;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
//scene.add(cube);

//add original geometry

// 頂点 (Vector3) の配列を準備
var vertices = [
    new THREE.Vector3(2, 2, -0.1),
    new THREE.Vector3(-2, 2, -0.1),
    new THREE.Vector3(-2, -2, -0.1),
    new THREE.Vector3(2, -2, -0.1),
];

// ポリゴン面を構成する頂点のインデックス (Face3の代替となる情報)
var faces = [
    0, 1, 2,
    2, 3, 0,
];

var geometry2 = new THREE.BufferGeometry();

// 頂点情報をBufferGeometryにセット
// BufferAttributeを生成する代わりに、setFromPointsを呼ぶと内部でいいようにやってくれる
geometry2.setFromPoints(vertices);

// ポリゴン面を構成する頂点のインデックスをセット
geometry2.setIndex(faces);

const material2 = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
const plane = new THREE.Mesh(geometry2, material2);
scene.add(plane);



//fold to geometry
const fish = await fileLoad("../cp_data/fish.fold");
const geo3 = fold2geometry(fish);
const mat3 = new THREE.MeshBasicMaterial({ color: 0x0000FF });
const origami = new THREE.Mesh(geo3, mat3);
scene.add(origami);

origami.rotation.z = Math.PI / 4;
plane.rotation.z = Math.PI / 4;


async function fileLoad(path) {
    const resp = await fetch(path);
    const text = await resp.text();
    return JSON.parse(text);
}
function fold2geometry(fold) {
    const vertices = [];
    let i = 0;
    for (const v of fold.vertices_coords) {
        vertices.push(new THREE.Vector3(v[0] / 100, v[1] / 100, i++ / 10));
    }
    const faces = [];
    for (const f of fold.faces_vertices) {
        faces.push(f[0], f[1], f[2], f[2], f[1], f[0]);//add booth face
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(vertices);
    geometry.setIndex(faces);
    return geometry;
}

camera.position.z = 5;

function animate() {
    //origami.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);

}