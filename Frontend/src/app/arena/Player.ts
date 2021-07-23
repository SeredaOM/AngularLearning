import { RoundObstacle } from './Obstacles/RoundObstacle';

export class Player {
  public static get radius() {
    return 30;
  }

  private static fieldCenterX: number = 0;
  private static fieldCenterY: number = 0;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public x: number,
    public y: number,
    screenCenterX: number,
    screenCenterY: number
  ) {
    Player.fieldCenterX = screenCenterX;
    Player.fieldCenterY = screenCenterY;
  }

  public drawPlayer() {
    this.ctx.beginPath();
    this.ctx.arc(
      Player.fieldCenterX,
      Player.fieldCenterY,
      Player.radius,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.lineWidth = 3;
    this.ctx.fillStyle = '#ebe6a7';
    this.ctx.strokeStyle = '#14140e';
    this.ctx.stroke();
    this.ctx.fill();
  }

  public static isMoveBlockedByObstacle(
    newCenterX: number,
    newCenterY: number,
    obstacle: RoundObstacle
  ): boolean {
    let dx = newCenterX - obstacle.x;
    let dy = newCenterY - obstacle.y;
    let d = Math.sqrt(dx * dx + dy * dy);

    return d <= Player.radius + obstacle.radius;
  }

  public static isMoveAllowed(
    newCenterX: number,
    newCenterY: number,
    obstacles: RoundObstacle[]
  ): RoundObstacle {
    let nearestObstacle = null;

    for (let i = 0; i < obstacles.length; i++) {
      let obstacle = obstacles[i];

      if (Player.isMoveBlockedByObstacle(newCenterX, newCenterY, obstacle)) {
        nearestObstacle = obstacle;
        i = obstacles.length - 1;
      }
    }
    return nearestObstacle;
  }
}
