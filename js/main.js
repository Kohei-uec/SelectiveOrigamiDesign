import { CP } from "./cp.js";
import { CPView } from "./cp_view.js";

console.log('main.js load');
let cp = new CP();
const canvas = document.getElementById('cp_canvas');
const view = new CPView(canvas, cp);
view.draw();

const testFile = document.getElementById('test_file')
testFile.addEventListener('change', () => {
    loadFile(testFile.files[0]);
});
function loadFile(file) {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        cp = CP.parse(reader.result);
        view.cp = cp;
        view.draw();
        console.log('file load', cp);
    }
}


const wrap_canvas = document.getElementById('wrap_cp_canvas')
window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
    const h = wrap_canvas.clientHeight;
    const w = wrap_canvas.clientWidth;
    const l = Math.min(h, w);
    canvas.height = l;
    canvas.width = l;
    view.draw();
}
resizeCanvas();


