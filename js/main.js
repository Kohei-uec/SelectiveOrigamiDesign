import { DOMResize } from './resize.js';
import { CPView } from './cp_view.js';
import { FOLDView } from './fold_view.js';
import { Face } from './face.js';
import { FaceColor, PartsSelect } from './gui.js';

let cp;
const cp_canvas = document.getElementById('cp_canvas');
const cp_view = new CPView(cp_canvas, cp);

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
const faceColor = new FaceColor();
