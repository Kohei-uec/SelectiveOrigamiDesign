import { DOMResize } from "./resize.js";
import { CP } from "./cp.js";
import { CPView } from "./cp_view.js";
import { FOLDView } from "./fold_view.js";

//import Ear from "https://rabbit-ear.github.io/rabbit-ear/src/index.js"
//console.log(Ear.webgl);

async function loadCPFile(path) {
    const resp = await fetch(path);
    const text = await resp.text();
    return CP.parse(text);
}

let cp = await loadCPFile("../cp_data/face01.cp");
const cp_canvas = document.getElementById('cp_canvas');
const cp_view = new CPView(cp_canvas, cp);
cp_view.draw();

const testFile = document.getElementById('test_file')
testFile.addEventListener('change', () => {
    loadFile(testFile.files[0]);
});
function loadFile(file) {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        cp = CP.parse(reader.result);
        cp_view.cp = cp;
        cp_view.draw();
        console.log('file load', cp);
    }
}


const wrap_cp = document.getElementById('wrap_cp_canvas');
new DOMResize(cp_canvas, wrap_cp, () => { cp_view.draw() });

//fold
const wrap_fold = document.getElementById('wrap_fold');
const fold_view = new FOLDView(wrap_fold);
fold_view.setFOLD(cp);


//test
const test_btn = document.getElementById('test_btn');
test_btn.addEventListener('click', async () => {
    const resp = await fetch('../cp_data/itto.cp');
    const text = await resp.text();
    cp.combine(text);
    cp_view.draw();


    fold_view.init();
    fold_view.setFOLD("../cp_data/face_parts/eyeL.fold");
    fold_view.setFOLD("../cp_data/face_parts/eyeR.fold");
    fold_view.setFOLD("../cp_data/face_parts/top.fold");
    fold_view.setFOLD("../cp_data/face_parts/mouse.fold");
    fold_canvas_resize.resize();
})