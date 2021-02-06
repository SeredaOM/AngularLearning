export class Tree {
    private static get innerRadius() { return 30; }
    private static get outerRadius() { return 80; }

    constructor(public ctx: CanvasRenderingContext2D, public x: number, public y: number) { }

    public static generateTrees(ctx: CanvasRenderingContext2D, numberOfTrees: number, fieldWidth: number, fieldHeight: number): Array<Tree> {

        var trees: Array<Tree> = [];

        for (let i = 0; i < numberOfTrees; i++) {
            let x = Math.floor((Math.random() * (fieldWidth - 200)) + 100);
            let y = Math.floor((Math.random() * (fieldHeight - 200)) + 100);

            trees.push(new Tree(ctx, x, y));
        }

        return trees;
    }


    public drawTree(centerX, centerY) {
        this.ctx.beginPath();
        this.ctx.arc(centerX + this.x, centerY + this.y, Tree.innerRadius, 0, 2 * Math.PI, false);
        this.ctx.lineWidth = 3;
        this.ctx.fillStyle = '#CD853F';
        this.ctx.strokeStyle = '#A0522D';
        this.ctx.stroke();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(centerX + this.x, centerY + this.y, Tree.outerRadius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = '#8080A97D';
        this.ctx.strokeStyle = '#8084c586';
        this.ctx.stroke();
        this.ctx.fill();
    }
}