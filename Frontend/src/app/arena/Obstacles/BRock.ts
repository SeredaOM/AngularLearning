import { RoundObstacle } from './RoundObstacle';

export class BRock extends RoundObstacle {
    private static get radius() { return 135; }

    constructor(public ctx: CanvasRenderingContext2D, public x: number, public y: number, public name: string) {
        super(x, y, BRock.radius);
    }
    // constructor(public ctx: CanvasRenderingContext2D, public x: number, public y: number) { }

    public static generateBRocks(ctx: CanvasRenderingContext2D, numberOfBRocks: number, fieldWidth: number, fieldHeight: number): Array<BRock> {

        var bRocks: Array<BRock> = [];

        for (let i = 0; i < numberOfBRocks; i++) {
            let x = Math.floor((Math.random() * (fieldWidth - 200)) + 100);
            let y = Math.floor((Math.random() * (fieldHeight - 200)) + 100);

            bRocks.push(new BRock(ctx, x, y, i.toString()));
        }


        return bRocks;
    }


    public drawBRock(centerX, centerY) {
        this.ctx.beginPath();
        this.ctx.arc(centerX + this.x, centerY + this.y, BRock.radius, 0, 2 * Math.PI, false);
        this.ctx.lineWidth = 7;
        this.ctx.fillStyle = '#c2c1be';
        this.ctx.strokeStyle = '#a6a5a2';
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.fillStyle = '#000';
    }
}