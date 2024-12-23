import { DOMResize } from './resize.js';
import { CPView } from './cp_view.js';
import { FOLDView } from './fold_view.js';
import { Face } from './face.js';
import { CP } from './cp.js';
import { GUI } from './gui.js';
import * as modal from './modal.js';
import { Project } from './gui.js';

let cp = new CP();
const cp_canvas = document.getElementById('cp_canvas');
const cp_view = new CPView(cp_canvas, cp);

const wrap_cp = document.getElementById('wrap_cp_canvas');
new DOMResize(cp_canvas, wrap_cp, () => {
    cp_view.draw();
});

//fold
const wrap_fold = document.getElementById('wrap_fold');
const fold_view = new FOLDView(wrap_fold);

//project
const face = new Face();

//gui
const gui = new GUI(face, cp_view, fold_view);

//feedback
const links = document.getElementsByClassName('feedback_link');
for (const l of links) {
    l.onclick = (e) => {
        //do not prevent default
        //send face project JSON to DB
        const url =
            'https://script.google.com/macros/s/AKfycbwXE_VDYTkJP8OQ80VIjYAB9cFREZ36mjVDPziDdOJKoaTw1rXXdSYJ3WvaLc-bHDes/exec';
        const body = JSON.stringify(new Project(face, fold_view));
        fetch(url, {
            method: 'POST',
            body: body,
            mode: 'no-cors',
        });
        console.log('send', body);
    };
}
