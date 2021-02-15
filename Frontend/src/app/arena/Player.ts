import { RoundObstacle } from "./Obstacles/RoundObstacle";

export class Player {
    public static get radius() { return 30; }

    constructor(public ctx: CanvasRenderingContext2D, public x: number, public y: number) { }

    public drawPlayer() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, Player.radius, 0, 2 * Math.PI, false);
        this.ctx.lineWidth = 3;
        this.ctx.fillStyle = '#ebe6a7';
        this.ctx.strokeStyle = '#14140e';
        this.ctx.stroke();
        this.ctx.fill();
    }

    public isMoveBlockedByObstacle(newCenterX: number, newCenterY: number, obstacle: RoundObstacle): boolean {

        let dx = this.x - (newCenterX + obstacle.x);
        let dy = this.y - (newCenterY + obstacle.y);
        let d = Math.sqrt(dx * dx + dy * dy);

        return d <= Player.radius + obstacle.radius;
    }

    public isMoveAllowed(newCenterX: number, newCenterY: number, obstacles: RoundObstacle[]): boolean {
        let moveIsAllowed = true;

        for (let i = 0; i < obstacles.length; i++) {
            let obstacle = obstacles[i];

            if (this.isMoveBlockedByObstacle(newCenterX, newCenterY, obstacle)) {
                moveIsAllowed = false;
                i = obstacles.length - 1;
            }
        }
        return moveIsAllowed;
    }
}
