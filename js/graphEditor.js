class GraphEditor {
    constructor(viewport, graph) {
        this.viewport = viewport;
        this.canvas = viewport.canvas;
        this.graph = graph;
        this.ctx = this.canvas.getContext("2d"); // fixed: use this.canvas

        this.selected = this.hovered = this.mouse = null;
        this.dragging = false;

        this.#addEvents();
        this.display();
    }

    #addEvents() {
        this.canvas.addEventListener("mousedown", e => this.#onDown(e));
        this.canvas.addEventListener("mousemove", e => this.#onMove(e));
        this.canvas.addEventListener("mouseup", () => this.dragging = false);
        this.canvas.addEventListener("contextmenu", e => e.preventDefault());
    }

    #onDown(e) {
        this.mouse = this.viewport.getMouse(e); // use viewport coordinates

        if (e.button === 2) return this.#removePoint(this.hovered);

        if (this.hovered) {
            this.#select(this.hovered);
        } else {
            this.graph.addPoint(this.mouse);
            this.#select(this.mouse);
        }
        this.dragging = true;
        this.display();
    }

    #onMove(e) {
        this.mouse = this.viewport.getMouse(e); // fixed: use viewport coords
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 17);

        if (this.dragging && this.selected) Object.assign(this.selected, this.mouse);
        this.display();
    }

    #select(p) {
        if (this.selected && p !== this.selected) this.graph.tryAddSegment(new Segment(this.selected, p));
        this.selected = p;
    }

    #removePoint(p) {
        if (!p) return (this.selected = null);
        this.graph.removePoint(p);
        this.hovered = this.selected = null;
        this.display();
    }

    display() {
        // clear using viewport to respect zoom/pan
        this.viewport.clear();
        this.viewport.applyTransform();

        const { ctx, graph, selected, hovered, mouse, dragging } = this;
        graph.draw(ctx);

        if (!dragging && selected && mouse) {
            new Segment(selected, hovered || mouse).draw(ctx, { dash: [3, 3], color: "gray" });
            selected.draw(ctx, { outline: true });
        }
        if (hovered && hovered !== selected) hovered.draw(ctx, { fill: true });
    }
}
