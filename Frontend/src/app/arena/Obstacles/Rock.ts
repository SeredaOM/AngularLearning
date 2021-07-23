import { ViewScreen } from './ViewScreen';
import { RoundObstacle } from './RoundObstacle';

export abstract class Rock extends RoundObstacle {
  constructor(
    public ctx: CanvasRenderingContext2D,
    public x: number,
    public y: number,
    public name: string,
    public radius: number
  ) {
    super(x, y, radius);
  }

  protected abstract getFillColor(): string;
  protected abstract getStrokeColor(): string;

  public draw(viewX: number, viewY: number) {
    this.ctx.beginPath();
    this.ctx.arc(
      ViewScreen.centerX + this.x - viewX,
      ViewScreen.centerY + this.y - viewY,
      this.radius,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.lineWidth = 7;
    this.ctx.fillStyle = this.getFillColor();
    this.ctx.strokeStyle = this.getStrokeColor();
    this.ctx.stroke();
    this.ctx.fill();
  }
}
