import ear from 'rabbit-ear';
//need import map (in html head)

export class FOLDView {
    constructor(wrap) {
        this.svg = ear.svg(wrap);
    }

    setFOLD(cp, i = 0) {
        //parse
        const t = {
            0: 'N',
            1: 'B',
            2: 'V', //reverse
            3: 'M', //reverse
        };
        const ass = [];
        for (const a of cp.edges_assignment) {
            ass.push(t[a]);
        }
        const coo = [];
        for (const c of cp.vertices_coords) {
            coo.push([(c[0] + 200) / 400, (c[1] + 200) / 400]);
        }

        //deep copy
        const fold = JSON.parse(
            JSON.stringify({
                frame_classes: ['creasePattern'],
                vertices_coords: cp.vertices_coords,
                edges_vertices: cp.edges_vertices,
                edges_assignment: ass,
            })
        );
        ear.graph.removeDuplicateVertices(fold);

        //compute folded face
        const graph = ear.graph(fold).populate({ faces: true });
        const face = graph.nearestFace([0, 0]);
        const folded = graph.flatFolded([face]);
        const solved = ear.layer(folded).compileAll();
        folded.faceOrders = solved[i % solved.length];
        //ear.graph.makeFacesLayer(folded);

        //display
        this.svg.removeChildren();
        this.svg.origami(folded);
        setSVGPadding(this.svg);
    }
}

function setSVGPadding(svg, padding = 10) {
    const viewBox = svg.getAttribute('viewBox').split(' ').map(Number);
    viewBox[0] -= padding;
    viewBox[1] -= padding;
    viewBox[2] += 2 * padding;
    viewBox[3] += 2 * padding;
    svg.setAttribute('viewBox', viewBox.join(' '));
}
