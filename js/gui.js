import { Face } from './face.js';
import { list } from '../cp_data/list.js';
import { cp2cpURL, cp2pngURL, cp2svgURL, DLFile, fold2foldURL, fold2pngURL, fold2svgURL } from './file.js';

export class GUI {
    constructor(face, cp_view, fold_view) {
        this.partsSelect = new PartsSelect(face, cp_view, fold_view);
        this.faceColor = new FaceColor(fold_view);
        this.faceOrder = new FaceOrders(face, fold_view);
        this.fileIO = new FileIO(cp_view, fold_view);
    }
}

class FileIO {
    constructor(cp_view, fold_view) {
        this.cp_view = cp_view;
        this.fold_view = fold_view;

        //add event listener
        document.getElementById('dl_cp_btn').addEventListener('click', () => {
            const name = document.getElementById('dl_cp_name').value;
            const type = document.getElementById('dl_cp_type').value;
            if (type === 'cp') {
                this.DL_cp_cp(name);
            } else if (type === 'svg') {
                this.DL_cp_svg(name);
            } else if (type === 'png') {
                this.DL_cp_png(name);
            }
        });

        document.getElementById('dl_fold_btn').addEventListener('click', () => {
            const name = document.getElementById('dl_fold_name').value;
            const type = document.getElementById('dl_fold_type').value;
            console.log(name, type);
            if (type === 'fold') {
                this.DL_fold_fold(name);
            } else if (type === 'svg') {
                this.DL_fold_svg(name);
            } else if (type === 'png') {
                this.DL_fold_png(name);
            }
        });
    }

    //cp
    DL_cp_svg(name) {
        DLFile({
            filename: name.length > 0 ? name : null,
            filetype: 'svg',
            url: cp2svgURL(this.cp_view.cp),
        });
    }
    DL_cp_cp(name) {
        DLFile({
            filename: name.length > 0 ? name : null,
            filetype: 'cp',
            url: cp2cpURL(this.cp_view.cp),
        });
    }
    DL_cp_png(name) {
        DLFile({
            filename: name.length > 0 ? name : null,
            filetype: 'png',
            url: cp2pngURL(this.cp_view.cp),
        });
    }
    //fold
    DL_fold_svg(name) {
        DLFile({
            filename: name.length > 0 ? name : null,
            filetype: 'svg',
            url: fold2svgURL(this.fold_view.svg),
        });
    }
    DL_fold_fold(name) {
        DLFile({
            filename: name.length > 0 ? name : null,
            filetype: 'fold',
            url: fold2foldURL(this.fold_view.folded),
        });
    }
    async DL_fold_png(name) {
        DLFile({
            filename: name.length > 0 ? name : null,
            filetype: 'png',
            url: await fold2pngURL(this.fold_view.svg),
        });
    }
}
class PartsSelect {
    constructor(face, cp_view, fold_view, names = Face.order) {
        //select and option
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

class FaceOrders {
    constructor(face, fold_view, id = 'wrap_order') {
        this.face = face;
        this.fold_view = fold_view;
        this.wrap = document.getElementById(id);

        //set event listener
        fold_view.onBuild = () => {
            this.setUI();
        };
    }
    setView() {
        const orders = document.getElementsByName('order');
        let n = 0;
        orders.forEach((order, i) => {
            n += 2 ** i * (order.checked ? 1 : 0);
        });
        this.fold_view.setOrderNum(n);
    }

    setUI() {
        //get order pattern
        const n = this.fold_view.getOrderNum();
        if (n <= 1) {
            this.wrap.innerHTML = '<button class="button" disabled>no choice</p>'; //init text
            return;
        }
        //add elm
        this.wrap.innerHTML = ''; //remove all children, add text
        for (let i = 0; i < Math.log2(n); i++) {
            const elm = this.createButton(i);
            this.wrap.appendChild(elm);

            elm.addEventListener('change', () => {
                this.setView();
            });
        }
    }
    createButton(i) {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'order';
        input.classList.add('order-reverse');
        input.id = 'btn' + i;
        input.style.display = 'none';

        const label = document.createElement('label');
        label.htmlFor = input.id;
        const btn = document.createElement('div');
        btn.classList.add('button', 'order-btn');
        btn.innerHTML = '<i class="fa-solid fa-shuffle"></i>';

        label.appendChild(btn);

        const wrap = document.createElement('div');
        wrap.append(input, label);
        return wrap;
    }
}
class FaceColor {
    constructor(fold_view, fid = 'front_color', bid = 'back_color') {
        this.fold_view = fold_view;
        this.inputs = [document.getElementById(fid), document.getElementById(bid)];
        this.inputs.forEach((elm) => {
            elm.addEventListener('change', (e) => {
                this.setColor();
            });
        });
    }
    setColor() {
        this.fold_view.setColor(this.inputs[0].value, this.inputs[1].value);
    }
}
