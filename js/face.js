import { CP } from './cp.js';
import * as file from './file.js';

//origami Face
export class Face {
    static order = ['top', 'bottom', 'left', 'right'];
    constructor(path = 'default.cp') {
        this.path = {};
        for (const part of Face.order) {
            this.setParts(part, path);
        }
    }

    async buildCP() {
        this.cp = new CP();
        for (const part of Face.order) {
            let path = '../cp_data/';
            if (part === 'left' || part === 'right') {
                path += 'side/';
            } else {
                path += part + '/';
            }
            path += this.path[part];
            this.cp.combine(await file.getFileText(path), part === 'right');
        }
        return this.cp;
    }

    setParts(position, path) {
        this.path[position] = path;
    }
}
