import { Face } from './face.js';
import { list } from '../cp_data/list.js';

export class GUI {
    constructor(face, cp_view, fold_view) {
        this.partsSelect = new PartsSelect(face, cp_view, fold_view);
        this.faceColor = new FaceColor();
        this.faceOrder = new FaceOrders(face, fold_view);
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
    constructor(fid = 'front_color', bid = 'back_color') {
        this.inputs = [document.getElementById(fid), document.getElementById(bid)];
        this.inputs.forEach((elm) => {
            elm.addEventListener('change', (e) => {
                this.setColor();
            });
        });
    }
    setColor() {
        const classNames = ['.front', '.back'];
        classNames.forEach((className, i) => {
            const rule = getRuleBySelector(className);
            rule.style.fill = this.inputs[i].value;
        });
    }
}

//https://qiita.com/life5618/items/950558e4b72c038333f8
// 指定セレクタのCSSルールを取得する
// 呼び出し例　getRuleBySelector(".inner1")   selectorにCSSセレクタ
function getRuleBySelector(selector) {
    for (const sheet of document.styleSheets) {
        try {
            sheet.cssRules;
        } catch {
            continue;
        }
        for (const rule of sheet.cssRules) {
            if (selector === rule.selectorText) {
                return rule;
            }
        }
    }
    return null;
}
