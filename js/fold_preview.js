import { CP } from './cp.js';
import * as file from './file.js';
import { FOLDView } from './fold_view.js';
import { getOptions } from '../cp_data/list.js';

export async function preview(type, fileName) {
    //cp
    const cp = await buildCP(type, fileName);

    //view
    const wrap_svg = document.createElement('div');
    const view = new FOLDView(wrap_svg);
    view.padding = 5;
    const options = getOptions(type, fileName);
    view.setFOLD(cp, options.order, options.reverse);
    view.draw();

    return wrap_svg;
}

async function buildCP(part, fileName) {
    const cp = new CP();
    let path = '/cp_data/';
    if (part === 'left' || part === 'right') {
        path += 'side/';
    } else {
        path += part + '/';
    }
    cp.combine(await file.getFileText(path + fileName), part === 'right');
    cp.combine(await file.getFileText(path + 'socket.cp'), part === 'right');
    return cp;
}
