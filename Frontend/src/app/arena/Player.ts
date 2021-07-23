import { RoundObstacle } from './Obstacles/RoundObstacle';
import { ViewScreen } from './Obstacles/ViewScreen';

export class Player {
  public static get radius() {
    return 30;
  }

  constructor(
    public ctx: CanvasRenderingContext2D,
    public x: number,
    public y: number
  ) {}

  public drawPlayer() {
    this.ctx.beginPath();
    this.ctx.arc(
      ViewScreen.centerX,
      ViewScreen.centerY,
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

    // if(obstacles==null)
    // {
    //     return null;
    // }

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
