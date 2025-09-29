class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(point) {
        return this.x === point.x && this.y === point.y;
    }

    draw(ctx, { size = 18, color = "black", outline = false, fill = false } = {}) {
        const rad = size / 2;
        
        // Draw main circle
        ctx.beginPath();
        ctx.fillStyle = color;   // fixed
        ctx.arc(this.x, this.y, rad, 0, Math.PI * 2);
        ctx.fill();

        // Optional outline
        if (outline) {
            ctx.beginPath();
            ctx.lineWidth = 1.2;
            ctx.strokeStyle = "yellow";  // fixed
            ctx.arc(this.x, this.y, rad * 0.6, 0, Math.PI * 2);
            ctx.stroke();
        }
        if(fill){
            ctx.beginPath();
            ctx.arc(this.x, this.y, rad*0.4, 0, Math.PI * 2);
            ctx.fillStyle = "yellow";
            ctx.fill();
         }
    }
    
}
