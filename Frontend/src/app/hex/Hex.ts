import { Tile } from './tile';

export class Hex {
    private color = 'red';
    private x = 0;
    private y = 0;
    private size = 30;

    readonly hexHalfW = 35;
    readonly lengthX = 20;
    readonly hexR = Math.sqrt(this.lengthX * this.lengthX + this.hexHalfW * this.hexHalfW);//40.31128874
    readonly hexDiag = 2 * this.hexR;
    readonly hexHeight = this.hexDiag;
    readonly hexWidth = 2 * this.hexHalfW;

    readonly tileR = 18;
    readonly tileD = 2 * this.tileR;
    readonly tileHalfW = this.tileR * 0.866;
    readonly tileW = this.tileHalfW * 2;
    readonly dist = this.tileR / 10;    //  maybe should be constant (2)?

    constructor(private ctx: CanvasRenderingContext2D) { }

    moveRight() {
        this.x++;
        this.draw();
    }

    private draw() {
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(this.x, this.y, this.size, this.size);

        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(this.x, this.y + this.size * 2, this.size, this.size);

        var cx = (this.x * (this.hexWidth + this.dist) - this.y * (this.hexWidth + this.dist) / 2) / 20;
        var cy = 200 + this.y * (this.hexR + this.lengthX + this.dist);

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - this.hexR);
        this.ctx.lineTo(cx + this.hexHalfW, cy - this.hexR + this.lengthX);
        this.ctx.lineTo(cx + this.hexHalfW, cy + this.hexR - this.lengthX);
        this.ctx.lineTo(cx, cy + this.hexR);
        this.ctx.lineTo(cx - this.hexHalfW, cy + this.hexR - this.lengthX);
        this.ctx.lineTo(cx - this.hexHalfW, cy - this.hexR + this.lengthX);
        this.ctx.lineTo(cx, cy - this.hexR);
        this.ctx.fill();

        this.ctx.lineWidth = 2; //  impacts ALL drawings, not only recent or next. needs to be more selective
        this.ctx.stroke();
    }

}
