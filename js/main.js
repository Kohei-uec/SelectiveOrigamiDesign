import { CanvasResize } from "./canvas.js";
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
new CanvasResize(cp_canvas, wrap_cp, () => { cp_view.draw() });

//fold
const fold_canvas = document.getElementById('fold_canvas');
const wrap_fold = document.getElementById('wrap_fold_canvas');
const fold_view = new FOLDView(fold_canvas, null);
const fold_canvas_resize = new CanvasResize(fold_canvas, wrap_fold, (l) => { fold_view.resize(l) });
fold_view.setFOLD("../cp_data/face01.fold")


//test
const test_btn = document.getElementById('test_btn');
test_btn.addEventListener('click', async () => {
    const resp = await fetch('../cp_data/itto.cp');
    const text = await resp.text();
    cp.combine(text);
    cp_view.draw();


    fold_view.init();
    fold_view.setFOLD("../cp_data/fish.fold");
    fold_view.setFOLD("../cp_data/face01_90.fold");
    fold_canvas_resize.resize();
})