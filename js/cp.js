import { Vec2d } from "./vec2d.js";

export class CP {
    constructor(obj) {
        this.vertices_coords = [];
        this.edges_vertices = [];

        if (obj && obj.vertices_coords && obj.lines_vertices) {
            this.vertices_coords = obj.vertices_coords;
            this.edges_vertices = obj.lines_vertices;
        } else if (obj === null) {
            //nothing in v,e
        } else {
            this.initSquare();
        }
    }
    static parse(cp_txt) {
        const lines = this.txt2lines(cp_txt);
        return this.lines2cp(lines);
    }
    static txt2lines(cp_txt) {
        const cp = cp_txt.split('\n');//行ごとに分割
        const liens = [];
        for (const line_txt of cp) {
            const line = line_txt.split(' ');//値ごとに分割
            if (line.length !== 5) {
                break;
            }
            let line_arr = [];
            for (const val of line) {
                line_arr.push(parseFloat([val]));
            }
            liens.push(line_arr)
        }
        return liens;
    }
    static lines2cp(lines) {
        const cp = new CP(null);
        for (const l of lines) {
            const v1_index = cp.add_v(l[1], l[2]);
            const v2_index = cp.add_v(l[3], l[4]);
            cp.add_e(v1_index, v2_index)
        }
        return cp;
    }


    initSquare() {
        this.vertices_coords = [
            [200, 200],
            [-200, 200],
            [-200, -200],
            [200, -200],
        ]

        this.edges_vertices = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
        ]
    }

    //vertices
    add_v(x, y) {
        const v1 = this.vertices_coords.findIndex((value) => Vec2d.Same(value[0], value[1], x, y));
        if (v1 === -1) {
            const length = this.vertices_coords.push([x, y]);
            return length - 1;
        } else {
            return v1;
        }
    }
    //edges
    add_e(v1, v2) {
        const l = this.edges_vertices.findIndex((val) => (val[0] === v1 && val[1] === v2) || (val[0] === v2 && val[1] === v1));
        if (l === -1) {
            const length = this.edges_vertices.push([v1, v2]);
            return length - 1;
        } else {
            return l;
        }
    }

}