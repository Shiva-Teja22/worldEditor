class Viewport {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // zoom & pan state
        this.zoom = 1;
        this.offsetX = 0;
        this.offsetY = 0;

        // for dragging
        this.dragging = false;
        this.lastX = 0;
        this.lastY = 0;

        this.#addEventListeners();
    }

    getMouse(evt) {
        // convert screen coords to world coords
        return new Point(
            (evt.offsetX - this.offsetX) / this.zoom,
            (evt.offsetY - this.offsetY) / this.zoom
        );
    }

    #addEventListeners() {
        this.canvas.addEventListener("wheel", this.#handleWheel.bind(this));

        this.canvas.addEventListener("mousedown", (evt) => {
    if (evt.button === 1 || (evt.button === 0 && evt.altKey)) {
        this.dragging = true;
        this.lastX = evt.clientX;
        this.lastY = evt.clientY;
        evt.preventDefault();
    }
});

this.canvas.addEventListener("mousemove", (evt) => {
    if (this.dragging) {
        const dx = evt.clientX - this.lastX;
        const dy = evt.clientY - this.lastY;
        this.offsetX += dx;
        this.offsetY += dy;
        this.lastX = evt.clientX;
        this.lastY = evt.clientY;
    }
});

this.canvas.addEventListener("mouseup", () => {
    this.dragging = false;
});


        // prevent context menu on middle click
        this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());
    }

    #handleWheel(evt) {
        evt.preventDefault();

        const scaleFactor = 1.1;
        const mouseX = evt.offsetX;
        const mouseY = evt.offsetY;

        const zoomDir = evt.deltaY < 0 ? 1 : -1;
        const newZoom = this.zoom * (zoomDir > 0 ? scaleFactor : 1 / scaleFactor);

        // clamp zoom
        if (newZoom < 0.5 || newZoom > 5) return;

        // adjust offset so zoom focuses on cursor
        this.offsetX = mouseX - (mouseX - this.offsetX) * (newZoom / this.zoom);
        this.offsetY = mouseY - (mouseY - this.offsetY) * (newZoom / this.zoom);

        this.zoom = newZoom;
    }

    applyTransform() {
        // apply zoom + pan to the canvas context
        this.ctx.setTransform(this.zoom, 0, 0, this.zoom, this.offsetX, this.offsetY);
    }

    clear() {
        // reset transform before clearing
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
