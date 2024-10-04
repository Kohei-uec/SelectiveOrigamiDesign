import { Face } from './face.js';
import { list } from '../cp_data/list.js';

export class PartsSelect {
    constructor(face, cp_view, fold_view, names = Face.order) {
        for (const name of names) {
            this[name] = document.getElementsByName(name)[0];

            this[name].addEventListener('change', (e) => {
                face.setParts(name, this[name].value);
                this.setView();
            });

            this.createOptionsList(this[name], name);
        }
        this.face = face;
        this.cp_view = cp_view;
        this.fold_view = fold_view;

        //init
        this.i = 0;
        this.setView();
    }

    async setView() {
        const cp = await this.face.buildCP();
        this.cp_view.cp = cp;
        this.cp_view.draw();
        this.fold_view.setFOLD(cp, this.i);
    }

    next() {
        this.i++;
        this.setView();
    }

    createOptionsList(select, name) {
        if (name === 'left' || name === 'right') {
            name = 'side';
        }
        for (const fn of list[name]) {
            const opt = document.createElement('option');
            opt.value = fn;
            opt.innerText = '@' + fn;
            select.appendChild(opt);
        }
    }
}
