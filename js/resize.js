export class DOMResize {
    constructor(dom, wrap, resizeListener) {
        this.dom = dom;
        this.wrap = wrap;
        this.resizeListener = resizeListener;
        window.addEventListener('resize', () => {
            this.resize(resizeListener);
        });
        this.resize(resizeListener);
    }

    resize(resizeListener) {
        const l = Math.min(this.wrap.clientHeight, this.wrap.clientWidth);
        this.dom.height = l;
        this.dom.width = l;
        if (resizeListener) {
            resizeListener(l);
        }
    }
}
