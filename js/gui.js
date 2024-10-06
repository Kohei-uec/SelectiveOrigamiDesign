import { Face } from './face.js';
import { list } from '../cp_data/list.js';

export class PartsSelect {
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

        //face order
        const btn = document.getElementById('order_btn');
        btn.addEventListener('click', async () => {
            this.next();
        });

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

export class FaceColor {
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
