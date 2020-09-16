
export class Square {
    private color = 'red';
    private x = 0;
    private y = 0;
    private size = 30;

    constructor(private ctx: CanvasRenderingContext2D) { }

    moveRight() {
        this.x++;
        this.draw();
    }

    private draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.size, this.size);

        this.ctx.strokeStyle = this.color;
        this.ctx.strokeRect(this.x, this.y + this.size * 2, this.size, this.size);
    }
}
