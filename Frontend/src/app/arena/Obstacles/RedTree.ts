import { RoundObstacle } from './RoundObstacle';
import { Tree } from './Tree';

export class RedTree extends Tree {

    constructor(public ctx: CanvasRenderingContext2D, public x: number, public y: number) {
        super(ctx, x, y);
    }


    public static generateTrees(ctx: CanvasRenderingContext2D, numberOfTrees: number, fieldWidth: number, fieldHeight: number): Array<Tree> {

        var trees: Array<Tree> = [];

        for (let i = 0; i < numberOfTrees; i++) {
            let x = Math.floor((Math.random() * (fieldWidth - 200)) + 100);
            let y = Math.floor((Math.random() * (fieldHeight - 200)) + 100);

            trees.push(new RedTree(ctx, x, y));
        }
        return trees;
    }

    public drawTree(centerX, centerY) {

        this.ctx.beginPath();
        this.ctx.arc(centerX + this.x, centerY + this.y, Tree.outerRadius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = '#FF7F50B3';
        this.ctx.strokeStyle = '#D1801386';
        this.ctx.stroke();
        this.ctx.fill();


        this.ctx.beginPath();
        this.ctx.arc(centerX + this.x, centerY + this.y, Tree.innerRadius, 0, 2 * Math.PI, false);
        this.ctx.lineWidth = 3;
        this.ctx.fillStyle = '#A88373';
        this.ctx.strokeStyle = '#91696A';
        this.ctx.stroke();
        this.ctx.fill();


    }
}