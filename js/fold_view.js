import ear from 'rabbit-ear';
//need import map (in html head)

export class FOLDView {
    constructor(wrap) {
        this.svg = ear.svg(wrap);
        this.onBuild = null; //event handler

        //init style
        this.colorF = '#353030';
        this.colorB = '#fef8f6';
        this.stroke_opacity = 1;
    }

    setColor(front, back, stroke) {
        this.colorF = front;
        this.colorB = back;
        this.stroke_opacity = stroke;
    }
    changeInLineStyle() {
        //set inline style
        //polygons
        const list = Array.from(this.svg.children[0].children).filter((node) => node.classList.contains('faces'))[0]
            .children;
        for (const poly of list) {
            if (poly.classList.contains('front')) {
                poly.setAttribute('fill', this.colorF);
            } else {
                poly.setAttribute('fill', this.colorB);
            }

            //stroke color
            poly.setAttribute('stroke-opacity', this.stroke_opacity);
        }
    }

    setFOLD(cp, i = 0, reverse) {
        this.build(cp, reverse);
        this.folded.faceOrders = this.all[i % this.all.length];
    }
    setPattern(pattern) {
        this.folded.faceOrders = this.solved.compile(...pattern);
    }
    setOrderNum(n) {
        this.folded.faceOrders = this.all[n % this.all.length];
    }
    getOrderNum() {
        return this.all.length;
    }
    setOrder(pattern) {
        const count = this.solved.count();
        let faceOrders;
        if (typeof count === 'object') {
            faceOrders = this.solved.compile(pattern);
        } else {
            faceOrders = this.all[i % this.all.length];
        }
        this.folded.faceOrders = faceOrders;
    }
    getCount() {
        const count = this.solved.count();
        if (typeof count === 'object') {
            return count;
        } else {
            return [];
        }
    }

    draw() {
        //display
        this.svg.removeChildren();
        this.svg.origami(this.folded, { strokeWidth: 0.001 });
        setSVGPadding(this.svg, this.padding);
        this.changeInLineStyle();
    }

    build(cp, reverse) {
        //parse
        const t = {
            0: 'N',
            1: 'B',
            2: reverse ? 'M' : 'V', //reverse
            3: reverse ? 'V' : 'M', //reverse
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
        const solved = ear.layer(folded);
        //console.log(folded, face, reverse);

        this.folded = folded;
        this.solved = solved;
        this.all = this.solved.compileAll();
        //console.log(solved.count(), solved.leaves());
        if (typeof this.onBuild === 'function') {
            this.onBuild();
        }
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
