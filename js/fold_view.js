import ear from "rabbit-ear";
//need import map (in html head)

export class FOLDView {
    constructor(wrap) {
        this.svg = ear.svg(wrap);
        this.svg.padding(10).strokeWidth(0.01).strokeLinecap("round").rotate(180);
        //window.addEventListener('resize', () => { this.resize(wrap) });
    }

    setFOLD(cp) {
        //parse
        const t = {
            0: 'N',
            1: 'B',
            2: 'M',
            3: 'V',
        }
        const ass = [];
        for(const a of cp.edges_assignment){
            ass.push(t[a]);
        }
        const coo = [];
        for(const c of cp.vertices_coords){
            coo.push([(c[0] + 200)/400, (c[1]+200)/400]);
        }

        //deep copy
        const fold = JSON.parse(JSON.stringify(
            {
                "frame_classes":["creasePattern"],
                "vertices_coords":cp.vertices_coords,
                "edges_vertices": cp.edges_vertices,
                "edges_assignment": ass,
            }
        ));
        ear.graph.removeDuplicateVertices(fold);

        //compute folded face
        const folded = ear.graph(fold).populate({ "faces": true }).flatFolded();
        folded.faceOrders = ear.layer(folded).faceOrders()
        //ear.graph.makeFacesLayer(folded);

        //display
        this.svg.origami(folded);
    }

    resize(wrap) {
        const l = Math.min(wrap.clientHeight, wrap.clientWidth);
        this.svg.size(l, l)
    }
}
