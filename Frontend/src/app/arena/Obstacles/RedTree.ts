import { RoundObstacle } from './RoundObstacle';
import { Tree } from './Tree';

export class RedTree extends Tree {
  constructor(
    public ctx: CanvasRenderingContext2D,
    public x: number,
    public y: number
  ) {
    super(ctx, x, y);
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

      trees.push(new RedTree(ctx, x, y));
    }
    return trees;
  }

  protected getInnerFillColor() {
    return '#A88373';
  }
  protected getInnerSrokeColor() {
    return '#91696A';
  }
  protected getOuterFillColor() {
    return '#FF7F50B3';
  }
  protected getOuterSrokeColor() {
    return '#D1801386';
  }
}
