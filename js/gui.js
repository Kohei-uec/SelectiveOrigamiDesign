import { Face } from './face.js';
import { list } from '../cp_data/list.js';
import * as file from './file.js';
import { preview } from './fold_preview.js';

export class GUI {
    constructor(face, cp_view, fold_view) {
        this.faceColor = new FaceColor(fold_view);
        this.faceOrder = new FaceOrders(face, fold_view);
        this.partsSelect = new PartsSelect(face, cp_view, fold_view, this.faceOrder);
        this.fileIO = new FileIO(face, cp_view, fold_view, this);

        //init
        this.setExample();
        this.partsSelect.setView();
    }

    setExample() {
        const list = ['example1', 'example2', 'AppIcon'];
        for (const v of list) {
            document.getElementById(v).addEventListener('click', async () => {
                let path = document.location.href;
                path = path.replace('index.html', '');
                const project = JSON.parse(await file.getFileText(`${path}example/${v}.json`));
                this.setProjectUI(project);
            });
        }
    }

    async setProjectUI(project) {
        this.faceColor.setColor(project.colors);
        await this.partsSelect.setSelection(project.path);
        this.faceOrder.setOrders(project.orders);
    }
}

class Project {
    constructor(face, fold_view) {
        this.path = {};
        for (const part of Face.order) {
            this.path[part] = face.path[part];
        }

        this.colors = {
            front: fold_view.colorF,
            back: fold_view.colorB,
        };

        const orders = document.getElementsByName('order');
        this.orders = [];
        orders.forEach((val) => {
            this.orders.push(val.checked);
        });
    }
}

class FileIO {
    constructor(face, cp_view, fold_view, GUI) {
        this.face = face;
        this.cp_view = cp_view;
        this.fold_view = fold_view;

        this.setProjectList();

        //add event listener
        document.getElementById('save_pro_btn').addEventListener('click', () => {
            const name = document.getElementById('save_pro_name').value;
            if (file.openLS(name)) {
                //over write?
                if (!confirm('overwrite?')) {
                    return;
                }
            }
            file.saveLS({
                filename: name.length > 0 ? name : null,
                obj: new Project(this.face, this.fold_view),
            });

            this.setProjectList();
        });
        document.getElementById('open_pro_btn').addEventListener('click', () => {
            const name = document.getElementById('open_pro_name').value;
            GUI.setProjectUI(file.openLS(name));
        });
        document.getElementById('upload_pro').addEventListener('change', () => {
            const file = document.getElementById('upload_pro').files[0];
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                GUI.setProjectUI(JSON.parse(reader.result));
            };
        });
        document.getElementById('dl_pro_btn').addEventListener('click', () => {
            const name = document.getElementById('dl_pro_name').value;
            file.DLFile({
                filename: name.length > 0 ? name : null,
                filetype: 'json',
                url: file.face2jsonURL(new Project(this.face, this.fold_view)),
            });
        });
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

    //local storage list
    setProjectList() {
        const select = document.getElementById('open_pro_name');
        if (localStorage.length > 0) {
            select.innerHTML = '';
        }
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            //const item = localStorage.getItem(key);
            const option = document.createElement('option');
            select.appendChild(option);
            option.value = key;
            option.innerText = key;
        }
    }

    //cp
    DL_cp_svg(name) {
        file.DLFile({
            filename: name.length > 0 ? name : null,
            filetype: 'svg',
            url: file.cp2svgURL(this.cp_view.cp),
        });
    }
    DL_cp_cp(name) {
        file.DLFile({
            filename: name.length > 0 ? name : null,
            filetype: 'cp',
            url: file.cp2cpURL(this.cp_view.cp),
        });
    }
    DL_cp_png(name) {
        file.DLFile({
            filename: name.length > 0 ? name : null,
            filetype: 'png',
            url: file.cp2pngURL(this.cp_view.cp),
        });
    }
    //fold
    DL_fold_svg(name) {
        file.DLFile({
            filename: name.length > 0 ? name : null,
            filetype: 'svg',
            url: file.fold2svgURL(this.fold_view.svg),
        });
    }
    DL_fold_fold(name) {
        file.DLFile({
            filename: name.length > 0 ? name : null,
            filetype: 'fold',
            url: file.fold2foldURL(this.fold_view.folded),
        });
    }
    async DL_fold_png(name) {
        file.DLFile({
            filename: name.length > 0 ? name : null,
            filetype: 'png',
            url: await file.fold2pngURL(this.fold_view.svg),
        });
    }
}

class PartsSelect {
    constructor(face, cp_view, fold_view, faceOrder) {
        //select and option
        for (const name of Face.order) {
            this[name] = document.getElementById(name);

            this.createOptionsList(this[name], name, (fn) => {
                face.setParts(name, fn);
                this.setView();
            });
        }

        this.face = face;
        this.cp_view = cp_view;
        this.fold_view = fold_view;
        this.faceOrder = faceOrder;
    }

    async setView() {
        const cp = await this.face.buildCP();
        this.cp_view.cp = cp;
        this.cp_view.draw();
        this.fold_view.setFOLD(cp);
        this.fold_view.setOrderNum(this.faceOrder.getOrderNum());
        this.fold_view.draw();
    }

    async createOptionsList(select, name, handler) {
        let ind = name;
        if (ind === 'left' || ind === 'right') {
            ind = 'side';
        }
        for (const fn of list[ind]) {
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = name;
            radio.classList.add('my-option-radio');
            radio.id = name + fn;
            if (fn === 'default.cp') {
                radio.checked = true;
            }

            const opt = document.createElement('label');
            opt.htmlFor = radio.id;
            opt.classList.add('my-option');
            opt.innerText = fn;
            opt.style.fontSize = 'small';
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    handler(fn);
                }
            });

            const wrap_svg = await preview(name, fn);
            wrap_svg.style.width = '100%';
            wrap_svg.style.aspectRatio = '5 / 4';

            opt.prepend(wrap_svg);
            select.append(radio, opt);
        }
    }

    async setSelection(selections) {
        for (const key of Object.keys(selections)) {
            const elm = document.getElementById(key + selections[key]);
            if (elm) {
                elm.checked = true;
                this.face.setParts(key, selections[key]); //not work event listener
            } else {
                throw new Error('no option');
            }
        }
        await this.setView();
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
    setOrders(inputs) {
        const orders = document.getElementsByName('order');
        orders.forEach((order, i) => {
            order.checked = inputs[i] ?? false;
        });
        this.setView();
    }
    getOrderNum() {
        const orders = document.getElementsByName('order');
        let n = 0;
        for (let i = 0; i < orders.length - 1; i++) {
            n += 2 ** i * (orders[i].checked ? 1 : 0);
        }
        if (orders.length > 0) {
            n += 2 ** (orders.length - 1) * (orders[orders.length - 1].checked ? 0 : 1); //last order default reversed
        }
        return n;
    }
    setView() {
        this.fold_view.setOrderNum(this.getOrderNum());
        this.fold_view.draw();
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
                this.setView();
            });
        });
    }

    setColor(colors) {
        this.inputs[0].value = colors.front;
        this.inputs[1].value = colors.back;
        this.setView();
    }

    setView() {
        this.fold_view.setColor(this.inputs[0].value, this.inputs[1].value);
        this.fold_view.changeInLineStyle();
    }
}
