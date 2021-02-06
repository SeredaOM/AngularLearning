export class Player {
    private static get radius() { return 30; }

    constructor(public ctx: CanvasRenderingContext2D, public x: number, public y: number) { }

    public drawPlayer() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, Player.radius, 0, 2 * Math.PI, false);
        this.ctx.lineWidth = 3;
        this.ctx.fillStyle = '#ebe6a7';
        this.ctx.strokeStyle = '#14140e';
        this.ctx.stroke();
        this.ctx.fill();
    }
}
