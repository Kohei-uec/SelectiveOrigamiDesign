export class CanvasResize {
    constructor(canvas, wrap, resizeListener) {
        this.dom = canvas;
        this.wrap = wrap;
        this.resizeListener = resizeListener;
        window.addEventListener('resize', () => { this.resize() });
        this.resize()
    }

    resize() {
        const l = Math.min(this.wrap.clientHeight, this.wrap.clientWidth);
        this.dom.height = l;
        this.dom.width = l;
        if (this.resizeListener) {
            this.resizeListener();
        }
    }
}