import { DOMResize } from './resize.js';
import { CP } from './cp.js';
import { CPView } from './cp_view.js';
import { FOLDView } from './fold_view.js';
import * as file from './file.js';
import { Face } from './face.js';
import { PartsSelect } from './gui.js';

let cp = await file.loadCP('../cp_data/face01.cp');
const cp_canvas = document.getElementById('cp_canvas');
const cp_view = new CPView(cp_canvas, cp);
cp_view.draw();

const testFile = document.getElementById('test_file');
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
    };
}

const wrap_cp = document.getElementById('wrap_cp_canvas');
new DOMResize(cp_canvas, wrap_cp, () => {
    cp_view.draw();
});

//fold
const wrap_fold = document.getElementById('wrap_fold');
const fold_view = new FOLDView(wrap_fold);

const face = new Face();

//gui
const selectGUI = new PartsSelect(face, cp_view, fold_view);

//test
const test_btn = document.getElementById('test_btn');
test_btn.addEventListener('click', async () => {
    selectGUI.next();
    return;
});
