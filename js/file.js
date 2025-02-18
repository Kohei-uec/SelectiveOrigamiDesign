import { CP, edgeStr } from './cp.js';
import { CPView } from './cp_view.js';

export async function getFileText(path) {
    //絶対パスを変換する
    if (path[0] === '/') {
        const dirs = location.href.split('/');
        const file = dirs[dirs.length - 1];
        const root = location.href.replace(file, '');
        path = root + path.slice(1);
    }
    return await (await fetch(path)).text();
}

export async function loadCP(path) {
    const resp = await fetch(path);
    const text = await resp.text();
    return CP.parse(text);
}

//local storage
export function saveLS(option) {
    const filename = option.filename ?? 'origamiFace';
    const filetype = option.filetype ?? 'json';
    const obj = option.obj ?? { origami: null };
    obj.filetype = filetype;
    const objTxt = JSON.stringify(obj);

    return localStorage.setItem(filename, objTxt);
}
export function openLS(name) {
    const data = localStorage.getItem(name);
    if (data) {
        return JSON.parse(data);
    }
    return data;
}

//real file
export function DLFile(option) {
    const filename = option.filename ?? 'origamiFace';
    const filetype = option.filetype ?? 'txt';
    const url = option.url ?? 'data:,OrigamiFaceMaker';

    const a = document.createElement('a');
    a.download = filename + '.' + filetype;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

//project
export function face2jsonURL(face) {
    const blob = new Blob([JSON.stringify(face)], { type: 'text/plain' });
    return URL.createObjectURL(blob);
}

//fold
export async function fold2pngURL(svgNode, radio = 1) {
    const width = 1024;
    const height = width * radio;
    const svgWidth = Math.min(width, height);
    svgNode = svgNode.cloneNode(true);
    svgNode.setAttribute('width', svgWidth + 'px');
    svgNode.setAttribute('height', svgWidth + 'px'); //svgは正方形

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    const img = new Image();
    img.src = fold2svgURL(svgNode);
    await img.decode();
    ctx.drawImage(img, (width - svgWidth) / 2, (height - svgWidth) / 2, svgWidth, svgWidth);
    return canvas.toDataURL('image/' + 'png');
}
export function fold2foldURL(fold) {
    const blob = new Blob([JSON.stringify(fold)], { type: 'text/plain' });
    return URL.createObjectURL(blob);
}
export function fold2svgURL(svgNode) {
    const svgText = new XMLSerializer().serializeToString(svgNode);
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
    return URL.createObjectURL(svgBlob);
}

//cp
export function cp2cpURL(cp) {
    const blob = new Blob([lines2str(cp)], { type: 'text/plain' });
    return window.URL.createObjectURL(blob);
}
export function cp2svgURL(cp) {
    const blob = new Blob([lines2svg(cp)], { type: 'text/plain' });
    return window.URL.createObjectURL(blob);
}
export function cp2pngURL(cp) {
    const canvas = document.createElement('canvas');
    const margin = 10;
    const size = 1024;
    canvas.width = size;
    canvas.height = size;
    const view = new CPView(canvas, cp);
    view.scale = (size - margin) / 400;
    view.preMouse.x = size / 2;
    view.preMouse.y = size / 2;
    view.draw();
    return canvas.toDataURL('image/' + 'png');
}
function lines2str(cp) {
    let str = '';
    for (let i = 0; i < cp.edges_vertices.length; i++) {
        const edge_v = cp.edges_vertices[i];
        const as = cp.edges_assignment[i];
        const v0 = cp.vertices_coords[edge_v[0]];
        const v1 = cp.vertices_coords[edge_v[1]];

        str += `${as} ${v0[0]} ${v0[1]} ${v1[0]} ${v1[1]} \n`;
    }
    return str;
}
function lines2svg(cp) {
    const x = -200,
        y = -200,
        w = 400,
        h = 400;

    let txt = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
    width="${w}"
    height="${h}"
    viewBox="${x} ${y} ${w} ${h}"
    version="1.1"
    id="svg1"
    >
    <g inkscape:groupmode="layer" id="Lines" inkscape:label="Lines">
    `;

    for (let i = 0; i < cp.edges_vertices.length; i++) {
        const color = CPView.lineType2color(cp.edges_assignment[i]);
        const v = [cp.vertices_coords[cp.edges_vertices[i][0]], cp.vertices_coords[cp.edges_vertices[i][1]]];
        const p = [v[0][0], v[0][1], v[1][0], v[1][1]];

        txt += `<path 
        style="stroke:${color};stroke-width:0.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" 
        fill="none"  
        d="M ${p[0]} ${p[1]} L ${p[2]} ${p[3]} "/>
        `;
    }

    txt += `</g></svg>`;
    return txt;
}
