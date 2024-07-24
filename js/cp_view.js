import { Vec2d } from "./vec2d.js";
import { CP } from "./cp.js";

export class CPView {
    static width = 2;
    static rad = 2.5;
    static move_rad = 5;
    constructor(canvas, cp) {
        //右クリック無効化
        canvas.oncontextmenu = () => false;
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.cp = cp;
        this.scale = 1;
        this.preScale = 1;
        this.transVec = new Vec2d(0, 0);
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e), false);
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
        this.canvas.addEventListener('wheel', (e) => this.onMouseWheel(e), false);
        this.canvas.addEventListener('touchmove', (e) => this.ontouchmove(e), false);
        this.canvas.addEventListener('touchstart', (e) => this.ontouchstart(e), false);
        this.canvas.addEventListener('touchend', (e) => this.ontouchend(e), false);
        this.preMouse = new Vec2d();
        this.pressedMouse = new Vec2d();
        this.pressedMouseButton;
        this.preDis = 0;
        this.preTouch = new Vec2d();
        this.preTouch2 = new Vec2d();
        this.pressedTouch = new Vec2d();
        this.time_start;
        this.interval_time = 50;
        this.longTouchTime = 330;
        this.inLongTouch = false;
        this.interval_id;
        this.moved = false;

        //this.controller;

        //shortcut
        document.body.onmouseup = () => this.end();
        document.body.ontouchend = () => this.end();
    }
    draw() {
        let ctx = this.context;
        //clear
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        //this.drawPoint(this.preMouse,CPView.rad*3,'rgb(0,200,200)');

        // set view
        let canvas_c = new Vec2d(this.canvas.width / 2, this.canvas.height / 2);
        let dt = new Vec2d(this.preMouse);
        dt.sub(canvas_c).sub(this.transVec).scale(this.preScale - this.scale).scale(1 / this.scale);
        this.preScale = this.scale;
        this.transVec.add(dt);
        ctx.translate(this.transVec.x, this.transVec.y);
        ctx.translate(canvas_c.x, canvas_c.y);//canvas中心を0,0に
        ctx.scale(this.scale, this.scale);

        //lines
        for (let i = 0; i < this.cp.edges_vertices.length; i++) {
            const color = CPView.lineType2color(this.cp.edges_assignment[i]);
            const edge = this.cp.edges_vertices[i];
            const v1 = this.cp.vertices_coords[edge[0]];
            const v2 = this.cp.vertices_coords[edge[1]];
            this.drawLine(v1, v2, CPView.width / this.scale, color);
        }

        //vertices
        for (const ver of this.cp.vertices_coords) {
            this.drawPoint(ver, CPView.rad / this.scale, 'rgb(0,0,0)')
        }

        /*
        //selected
        for (const line of this.controller.EditState.l) {
            this.drawLine(line.v[0], line.v[1], View.width * 2 / this.scale, 'rgba(0,255,0,0.5)');
        }
        for (const ver of this.controller.EditState.v) {
            this.drawPoint(ver, CPView.rad * 2 / this.scale, 'rgba(0,255,0,0.5)')
        }
        for (const line of this.controller.shortcutState.l) {
            this.drawLine(line.v[0], line.v[1], View.width * 2 / this.scale, 'rgba(0,255,0,0.5)');
        }
        */
    }

    drawLine(v0, v1, width, color) {
        let ctx = this.context;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(v0[0], v0[1]);
        ctx.lineTo(v1[0], v1[1]);
        ctx.lineWidth = width;
        //ctx.globalAlpha=0.5;
        ctx.stroke();
    }
    drawPoint(v, rad, color) {
        let ctx = this.context;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(v[0], v[1], rad, 0, Math.PI * 2, true);
        ctx.fill();
    }

    //mouse
    onMouseDown(e) {
        let mousePos = this.getMousePosition(e);
        this.preMouse = mousePos;
        this.pressedMouse = mousePos;
        this.pressedMouseButton = e.which;
        this.moved = false;

        e.preventDefault();

        /*
        //short cut, start Listener
        if (this.pressedMouseButton == 1) {
            this.long_timer(mousePos);
            this.controller.startListener(this.origin_vec(mousePos));
        }
            */
    }

    onMouseMove(e) {
        let mousePos = this.getMousePosition(e);
        if (mousePos.distance(this.pressedMouse) > CPView.move_rad) { this.moved = true; }

        //move
        if (this.inLongTouch) { this.preMouse = mousePos; return; }
        // left(1),right(3)
        if ((this.pressedMouseButton == 3) /*|| (this.controller.EditState.mode == Controller.MOVE && this.pressedMouseButton == 1)*/) {
            this.transVec.add(mousePos).sub(this.preMouse);
            this.preMouse = mousePos;
            this.draw();
        }
        e.preventDefault();
    }

    onMouseWheel(e) {
        this.preMouse = this.getMousePosition(e);
        let delta = e.deltaY ? -(e.deltaY) : e.wheelDelta ? e.wheelDelta : -(e.detail);
        this.scale += 0.05 * ((delta < 0) ? -1 : 1);
        if (this.scale <= 0) { this.scale = 0.01; }
        this.draw();
        e.preventDefault();
    }
    onMouseUp(e) {
        this.pressedMouseButton = -1;
        if (!this.inLongTouch && !this.moved) {
            let mousePos = this.getMousePosition(e);
            let pos = this.origin_vec(mousePos);
            /*
            let fun = this.moved ? this.controller.endListener : this.controller.clickListener;
            fun(pos);
            */
        }
    }

    //touch
    ontouchmove(e) {
        let nowPos = this.getMousePosition(e.touches[0]);
        if (this.preTouch.distance(this.pressedTouch) > CPView.move_rad) { this.moved = true; }
        if (this.inLongTouch) { this.preTouch = nowPos; return; }

        if (e.touches.length == 2) {//2本指で移動
            this.transVec.add(nowPos).sub(this.preTouch);
            this.preMouse = nowPos;
            this.preTouch = nowPos;

            if (this.preDis != 0) {
                let pos1 = this.getMousePosition(e.touches[1]);
                this.preTouch2 = pos1;
                let dis = nowPos.distance(pos1);
                this.scale *= dis / this.preDis;
                this.preDis = dis;
            } else if (this.preDis == 0) {
                let pos1 = this.getMousePosition(e.touches[1]);
                pos1 = new Vec2d(pos1.x, pos1.y);
                this.preDis = nowPos.distance(pos1);
            }
        }/* else if (this.controller.EditState.mode == Controller.MOVE) {//mode MOVEで移動
            if (this.preTouch2) {
                if (this.preTouch.distance(nowPos) > this.preTouch2.distance(nowPos)) {
                    this.transVec.add(nowPos).sub(this.preTouch2);
                } else {
                    this.transVec.add(nowPos).sub(this.preTouch);
                }
            } else {
                this.transVec.add(nowPos).sub(this.preTouch);
            }
            this.preMouse = nowPos;
            this.preTouch = nowPos;
        }*/
        this.draw();
        e.preventDefault();
    }
    ontouchstart(e) {
        if (e.touches.length >= 2) { return; } else { this.preTouch2 = false; }
        e.preventDefault();
        let mousePos = this.getMousePosition(e.touches[0]);
        this.preMouse = mousePos;
        this.pressedMouse = mousePos;
        this.preTouch = mousePos;
        this.pressedTouch = mousePos;
        this.moved = false;
        this.long_timer(mousePos);
        //this.controller.startListener(this.origin_vec(mousePos));
    }
    ontouchend(e) {
        this.preDis = 0;
        if (!this.inLongTouch) {
            let pos = this.origin_vec(this.preTouch);
            /*
            let fun = this.moved ? this.controller.endListener : this.controller.clickListener;
            fun(pos);
            */
        } if (this.inLongTouch && e.touches.length == 0) {
            //this.controller.shortcutdo(this.preTouch, this.pressedMouse, true);
        }
        this.end();
    }

    //position util
    origin_vec(Pos) {
        let ctx = this.context;
        let storedTransform = ctx.getTransform();
        let matrix = [
            [storedTransform.a, storedTransform.c, storedTransform.e],
            [storedTransform.b, storedTransform.d, storedTransform.f],
            [0, 0, 1]
        ];
        let i = math.inv(matrix);
        let j = [Pos.x, Pos.y, 1];
        let origin = math.multiply(i, j);
        return new Vec2d(origin[0], origin[1]);
    }

    getMousePosition(evt) {
        let rect = this.canvas.getBoundingClientRect();
        return new Vec2d(evt.clientX - rect.left, evt.clientY - rect.top);
    }

    //timer
    long_timer(mousePos) {
        this.interval_id = window.setInterval(() => {
            if (this.moved) {
                clearInterval(this.interval_id);
                return;
            }
            console.log('long!')
            this.inLongTouch = true;
            let pos = this.origin_vec(mousePos);
            clearInterval(this.interval_id);
            //this.controller.shortcutListener(pos, mousePos);
        }, this.longTouchTime);
    }
    end() {
        this.pressedMouseButton = -1;
        this.inLongTouch = false;
        clearInterval(this.interval_id);
        //this.controller.shortcut_end();
    }

    ///////
    rescale() {
        let w = this.canvas.width / 500;
        let h = this.canvas.height / 500;
        this.scale = w < h ? w : h;
        this.preScale = this.scale;
        this.draw();
    }

    static lineType2color(type) {
        let color;
        switch (type) {
            case CP.line.cut: color = 'rgb(0,0,0)'; break;
            case CP.line.mountain: color = 'rgb(255,0,0)'; break;
            case CP.line.valley: color = 'rgb(0,0,255)'; break;
            default: color = 'rgb(150,200,255)'; break;
        }
        return color
    }
}
