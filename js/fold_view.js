import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//need import map (in html head)

export class FOLDView {
    constructor(canvas, fold) {
        //右クリック無効化
        canvas.oncontextmenu = () => false;

        this.canvas = canvas;
        this.fold = fold;

        this.init();
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
        camera.lookAt(0, 0, 0);
        // カメラコントローラーを作成
        const controls = new OrbitControls(camera, this.canvas);
        // 滑らかにカメラコントローラーを制御する
        controls.enableDamping = true;
        controls.dampingFactor = 0.2;

        camera.position.z = 7;


        function animate() {
            renderer.render(scene, camera);
        }

        [this.scene, this.renderer, this.camera] = [scene, renderer, camera];
    }

    async setFOLD(path) {
        const fold = await loadFOLDfile(path);
        const geometry = fold2geometry(fold);
        const material = new THREE.MeshBasicMaterial({ color: 0x90909F });
        const origami = new THREE.Mesh(geometry, material);
        this.scene.add(origami);

        //lines
        for (let i = 0; i < fold.edges_vertices.length; i++) {
            const vertices = fold.edges_vertices[i];
            const pos = [];
            for (const v_i of vertices) {
                pos.push(new THREE.Vector3(
                    fold.vertices_coords[v_i][0] / 100,
                    fold.vertices_coords[v_i][1] / 100,
                    fold.vertices_coords[v_i][2] / 100));
            }
            const geo = lineGeometry(pos);
            const mat = new THREE.LineBasicMaterial({ color: 0x000000 });
            const line = new THREE.Line(geo, mat);
            this.scene.add(line);
        }

        return fold;
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
    for (let i = 0; i < fold.vertices_coords.length; i++) {
        const v = fold.vertices_coords[i]
        const d = 0
        vertices.push(new THREE.Vector3(v[0] / 100, v[1] / 100, v[2] / 100));
    }
    const faces = [];
    for (let i = 0; i < fold.faces_vertices.length; i++) {
        const vertices = fold.faces_vertices[i];
        //split triangle
        for (let j = 2; j < vertices.length; j++) {
            faces.push(vertices[0], vertices[j - 1], vertices[j])
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(vertices);
    geometry.setIndex(faces);
    return geometry;
}
function lineGeometry(pos) {
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(pos);
    return geometry;
}