import { RoundObstacle } from './RoundObstacle';

export class Rock extends RoundObstacle {
    private static get radius() { return 35; }

    constructor(public ctx: CanvasRenderingContext2D, public x: number, public y: number) {
        super(x, y, Rock.radius);
    }
    // constructor(public ctx: CanvasRenderingContext2D, public x: number, public y: number) { }

    public static generateRocks(ctx: CanvasRenderingContext2D, numberOfRocks: number, fieldWidth: number, fieldHeight: number): Array<Tree> {

        var rocks: Array<Rock> = [];

        for (let i = 0; i < numberOfRocks; i++) {
            let x = Math.floor((Math.random() * (fieldWidth - 200)) + 100);
            let y = Math.floor((Math.random() * (fieldHeight - 200)) + 100);

            rocks.push(new Rock(ctx, x, y));
        }

        return rocks;
    }


    public drawRock(centerX, centerY) {
        this.ctx.beginPath();
        this.ctx.arc(centerX + this.x, centerY + this.y, Rock.radius, 0, 2 * Math.PI, false);
        this.ctx.lineWidth = 7;
        this.ctx.fillStyle = '#c2c1be';
        this.ctx.strokeStyle = '#a6a5a2';
        this.ctx.stroke();
        this.ctx.fill();
    }
}