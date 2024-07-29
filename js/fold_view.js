import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//need import map (in html head)

export class FOLDView {
    constructor(canvas, fold) {
        //右クリック無効化
        canvas.oncontextmenu = () => false;

        this.canvas = canvas;
        this.fold = fold;

        [this.scene, this.renderer, this.camera] = this.init();
    }

    //initialize three js
    init() {
        //シーン
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xFFFFFF)
        //レンダー
        const renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        renderer.setSize(100, 100);
        renderer.setAnimationLoop(animate);
        //カメラ
        const camera = new THREE.PerspectiveCamera(45, 1.0, 0.5, 1000);
        // カメラコントローラーを作成
        const controls = new OrbitControls(camera, this.canvas);
        // 滑らかにカメラコントローラーを制御する
        controls.enableDamping = true;
        controls.dampingFactor = 0.2;

        camera.position.z = 5;


        function animate() {
            renderer.render(scene, camera);
        }

        return [scene, renderer, camera];
    }

    draw() {

    }

    async setFOLD(path) {
        const fold = await loadFOLDfile(path);
        const geometry = fold2geometry(fold);
        const material = new THREE.MeshBasicMaterial({ color: 0x90909F });
        const origami = new THREE.Mesh(geometry, material);
        this.scene.add(origami);
    }

    resize(l) {
        this.renderer.setSize(l, l);
        this.camera.updateProjectionMatrix();
    }
}



async function loadFOLDfile(path) {
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
