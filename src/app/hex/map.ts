import { Tile } from './tile';

export class Map {
  private tiles: Array<Array<Tile>>;
  private xMins: Array<number>;
  private xWidths: Array<number>;

  constructor(private ctx: CanvasRenderingContext2D, private radius: number) {
    // https://www.redblobgames.com/grids/hexagons/
    // Creates a hexagonal map that with the center at (0,0)

    const diameter = 1 + 2 * radius;
    this.tiles = new Array<Array<Tile>>(4 * diameter * diameter);
    this.xMins = new Array<number>(diameter);
    this.xWidths = new Array<number>(diameter);
    for (let y = -radius; y <= radius; y++) {
      const xMin = Math.max(-radius, -(y + radius));
      const xWidth = 2 * radius - Math.abs(y) + 5;
      const xMax = xMin + xWidth;
      let log = 'Line y=' + y + ', width=' + xWidth + ':';

      const raw = new Array<Tile>(xWidth);
      for (let x = xMin; x <= xMax; x++) {
        let terrain;
        if (x === 0 && y === 0) {
          terrain = 'desert';
        } else if (
          x === -radius ||
          y === -radius ||
          x + y === -radius ||
          x === radius ||
          y === radius ||
          x + y === radius
        ) {
          terrain = 'rock';
        } else {
          terrain = 'snow';
        }

        log += ' (' + x + ',' + y + ': ' + terrain + ')';
        raw[x - xMin] = new Tile(x, y, terrain, '');
      }

      // console.log(log);
      this.tiles[y + radius] = raw;
      this.xMins[y + radius] = xMin;
      this.xWidths[y + radius] = xWidth;
    }
  }

  static GetTerrainColor(terrain: string): { fill: string; stroke: string } {
    let colorFill: string;
    let colorStroke: string;

    switch (terrain) {
      case 'water':
        colorFill = '#00FFFF'; // cyan
        colorStroke = '#0000FF';
        break;

      case 'desert':
        colorFill = '#FFFF00'; // yellow
        colorStroke = '#800000';
        break;

      case 'swamp':
        colorFill = '#D2691E'; // chocolate
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

  private getTile(x: number, y: number): Tile {
    if (y < -this.radius) {
      // console.warning('y (' + y + ') < -radius (' + -this._radius + ')');
      return undefined;
    }
    if (y > this.radius) {
      // console.warning('y (' + y + ') > radius (' + this._radius + ')');
      return undefined;
    }

    const xMin = this.xMins[y + this.radius];
    // console.log('y=' + y + ', xMin=' + xMin);
    if (x < xMin) {
      // console.warn('x (' + x + ') < xMin (' + xMin + ') for y=' + y);
      return undefined;
    }
    const xWidth = this.xWidths[y + this.radius];
    if (x > xMin + xWidth) {
      // console.warn('x (' + x + ') > xWidth (' + xWidth + ') for y=' + y);
      return undefined;
    }
    const raw = this.tiles[y + this.radius];
    const tile = raw[x - xMin];

    return tile;
  }

  drawHex(
    cx: number,
    cy: number,
    radius: number,
    fillColor: string,
    strokeColor: string,
    strokeWidth: number
  ): void {
    const halfWidth = radius * 0.866; // tileR*sin(60)

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

  drawTile(tile: Tile): void {
    const tileR = 18;
    const tileHalfW = tileR * 0.866;
    const tileW = tileHalfW * 2;
    const dist = 1.1; //  10%

    const x = tile.getX(); // !== undefined ? tile.getX() : tile[0];
    const y = tile.getY(); // !== undefined ? tile.getY(): tile[1];
    const cx = 250 + (x + y / 2) * tileW * dist;
    const cy = 200 + y * tileR * 1.5 * dist;
    const terrain = tile.getTerrain(); // !== undefined ? tile.getTerrain() : tile[2];
    const color = Map.GetTerrainColor(terrain);

    this.drawHex(cx, cy, tileR, color.fill, color.stroke, 1);

    const resource = tile.getResource(); // !== undefined ? tile.resource : tile[3];
    if (resource !== undefined && resource !== '') {
      this.drawHex(cx, cy, tileR / 2, color.fill, color.stroke, 1);
    }
  }

  drawMap(): void {
    const mapRadius = 11;

    for (let y = -mapRadius; y <= mapRadius; y++) {
      for (let x = -mapRadius; x <= mapRadius; x++) {
        const tile = this.getTile(x, y);
        // console.log('x=' + x + ', y=' + y + ': tile is ' + (tile !== undefined ? tile.terrain : 'undefined'));
        if (tile !== undefined) {
          this.drawTile(tile);
        }
      }
    }
  }
}
