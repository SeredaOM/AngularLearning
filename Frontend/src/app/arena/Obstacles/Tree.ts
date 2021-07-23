import { RoundObstacle } from './RoundObstacle';
import { ViewScreen } from './ViewScreen';

export class Tree extends RoundObstacle {
  protected static get innerRadius() {
    return 30;
  }
  protected static get outerRadius() {
    return 80;
  }

  constructor(
    public ctx: CanvasRenderingContext2D,
    public x: number,
    public y: number
  ) {
    super(x, y, Tree.innerRadius);
  }

  public static generateTrees(
    ctx: CanvasRenderingContext2D,
    numberOfTrees: number,
    fieldWidth: number,
    fieldHeight: number
  ): Array<Tree> {
    var trees: Array<Tree> = [];

    for (let i = 0; i < numberOfTrees; i++) {
      let x = Math.floor(Math.random() * (fieldWidth - 200) + 100);
      let y = Math.floor(Math.random() * (fieldHeight - 200) + 100);

      trees.push(new Tree(ctx, x, y));
    }
    return trees;
  }

  protected getInnerFillColor() {
    return '#CD853F';
  }
  protected getInnerSrokeColor() {
    return '#A0522D';
  }
  protected getOuterFillColor() {
    return '#8080A97D';
  }
  protected getOuterSrokeColor() {
    return '#8084c586';
  }

  public draw(viewX: number, viewY: number) {
    this.ctx.beginPath();
    this.ctx.arc(
      ViewScreen.centerX + this.x - viewX,
      ViewScreen.centerY + this.y - viewY,
      Tree.innerRadius,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.lineWidth = 3;
    this.ctx.fillStyle = this.getInnerFillColor();
    this.ctx.strokeStyle = this.getInnerSrokeColor();
    this.ctx.stroke();
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(
      ViewScreen.centerX + this.x - viewX,
      ViewScreen.centerY + this.y - viewY,
      Tree.outerRadius,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.fillStyle = this.getOuterFillColor();
    this.ctx.strokeStyle = this.getOuterSrokeColor();
    this.ctx.stroke();
    this.ctx.fill();
  }
}
