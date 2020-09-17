import { Tile } from './tile';

export class Map {
    constructor(private ctx: CanvasRenderingContext2D) { }

    static GetTerrainColor(terrain: string) {
        var colorFill: string, colorStroke: string;

        switch (terrain) {
            case 'water':
                colorFill = '#00FFFF';//cyan
                colorStroke = '#0000FF';
                break;

            case 'desert':
                colorFill = '#FFFF00';//yellow
                colorStroke = '#800000';
                break;

            case 'swamp':
                colorFill = '#D2691E';	//	chocolate
                colorStroke = '#000000';
                break;

            case 'plain':
                colorFill = '#88FF88';
                colorStroke = '#008000';
                break;

            case 'forest':
                colorFill = '#00C000';
                colorStroke = '#000000';
                break;

            case 'rock':
                colorFill = '#888888';
                colorStroke = '#000000';
                break;

            case 'loot':
                colorFill = '#FFFFFF';
                colorStroke = '#000000';
                break;

            default:
                colorFill = '#CCCCCC';
                colorStroke = '#000000';
                break;
        }
        return { fill: colorFill, stroke: colorStroke };
    }

    drawHex(cx: number, cy: number, radius: number, fillColor: string, strokeColor: string, strokeWidth: number) {
        var halfWidth = radius * 0.866; // tileR*sin(60)

        this.ctx.fillStyle = fillColor;
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = strokeWidth;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - radius);
        this.ctx.lineTo(cx + halfWidth, cy - radius / 2);
        this.ctx.lineTo(cx + halfWidth, cy + radius / 2);
        this.ctx.lineTo(cx, cy + radius);
        this.ctx.lineTo(cx - halfWidth, cy + radius / 2);
        this.ctx.lineTo(cx - halfWidth, cy - radius / 2);
        this.ctx.lineTo(cx, cy - radius);
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawTile(tile: Tile) {
        var tileR = 18;
        var tileHalfW = tileR * 0.866;
        var tileW = tileHalfW * 2;
        var dist = 1.1; //  10%

        var x = tile.getX();    // !== undefined ? tile.getX() : tile[0];
        var y = tile.getY();    // !== undefined ? tile.getY(): tile[1];
        var cx = 50 + (x + y / 2) * tileW * dist;
        var cy = 40 + y * tileR * 1.5 * dist;
        var terrain = tile.getTerrain();    // !== undefined ? tile.getTerrain() : tile[2];
        var color = Map.GetTerrainColor(terrain);

        this.drawHex(cx, cy, tileR, color.fill, color.stroke, 1);

        var resource = tile.getResource();  // !== undefined ? tile.resource : tile[3];
        if (resource !== undefined && resource !== "") {
            this.drawHex(cx, cy, tileR / 2, color.fill, color.stroke, 1);
        }
    }
}