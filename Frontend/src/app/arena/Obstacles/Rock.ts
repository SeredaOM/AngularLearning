import { RoundObstacle } from './RoundObstacle';

export class Rock extends RoundObstacle {
  private static get radius() {
    return 35;
  }

  private static screenCenterX: number;
  private static screenCenterY: number;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public x: number,
    public y: number,
    public name: string
  ) {
    super(x, y, Rock.radius);
  }
  // constructor(public ctx: CanvasRenderingContext2D, public x: number, public y: number) { }

  public static generateRocks(
    ctx: CanvasRenderingContext2D,
    numberOfRocks: number,
    fieldWidth: number,
    fieldHeight: number,
    screenCenterX: number,
    screenCenterY: number
  ): Array<Rock> {
    var rocks: Array<Rock> = [];

    Rock.screenCenterX = screenCenterX;
    Rock.screenCenterY = screenCenterY;

    for (let i = 0; i < numberOfRocks; i++) {
      let x = Math.floor(Math.random() * (fieldWidth - 200) + 100);
      let y = Math.floor(Math.random() * (fieldHeight - 200) + 100);

      rocks.push(new Rock(ctx, x, y, i.toString()));
    }

    return rocks;
  }

  public drawRock(viewX, viewY) {
    this.ctx.beginPath();
    this.ctx.arc(
      Rock.screenCenterX + this.x - viewX,
      Rock.screenCenterY + this.y - viewY,
      Rock.radius,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.lineWidth = 7;
    this.ctx.fillStyle = '#c2c1be';
    this.ctx.strokeStyle = '#a6a5a2';
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.fillStyle = '#000';
  }
}
