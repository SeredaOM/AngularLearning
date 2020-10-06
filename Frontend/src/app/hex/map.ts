import { Tile } from './tile';

export class Map {
  //  Pixel coordinates of the (0,0) tile on the maps
  private static readonly mapCenterX = 250;
  private static readonly mapCenterY = 200;
  private tileR = 30;
  private tileHalfW: number;
  private tileW: number;
  private static readonly dist = 1.1; //  distance between tiles is 10% of the tile width
  private static readonly tileHorizontalShift = 1.5;

  private tiles: Array<Array<Tile>>;
  private xMins: Array<number>;
  private xWidths: Array<number>;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private mapRadius: number,
    private tileRadius: number
  ) {
    // https://www.redblobgames.com/grids/hexagons/
    // Creates a hexagonal map that with the center at (0,0)
    this.mapRadius = mapRadius;
    this.tileR = tileRadius;
    const diameter = 1 + 2 * this.mapRadius;
    this.defineSizing();

    this.tiles = new Array<Array<Tile>>(4 * diameter * diameter);
    this.xMins = new Array<number>(diameter);
    this.xWidths = new Array<number>(diameter);
    for (let y = -this.mapRadius; y <= this.mapRadius; y++) {
      const xMin = Math.max(-this.mapRadius, -(y + this.mapRadius));
      const xWidth = 2 * this.mapRadius - Math.abs(y) + 5;
      const xMax = xMin + xWidth;
      let log = 'Line y=' + y + ', width=' + xWidth + ':';

      const raw = new Array<Tile>(xWidth);
      for (let x = xMin; x <= xMax; x++) {
        let terrain;
        let resource = '';
        if (x === 0 && y === 0) {
          terrain = 'desert';
          resource = 'castle';
        } else if (
          x === -this.mapRadius ||
          y === -this.mapRadius ||
          x + y === -this.mapRadius ||
          x === this.mapRadius ||
          y === this.mapRadius ||
          x + y === this.mapRadius
        ) {
          terrain = 'rock';
        } else {
          terrain = 'snow';
        }

        log += ' (' + x + ',' + y + ': ' + terrain + ')';
        raw[x - xMin] = new Tile(x, y, terrain, resource);
      }

      // console.log(log);
      this.tiles[y + this.mapRadius] = raw;
      this.xMins[y + this.mapRadius] = xMin;
      this.xWidths[y + this.mapRadius] = xWidth;
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

  //  converts pixels of the canvas to the tile coordinates on the map
  getTileCoordinates(
    clickX: number,
    clickY: number,
    offsetX: number,
    offsetY: number
  ): { x: number; y: number } {
    //  relative position around the center
    const x = clickX - offsetX - Map.mapCenterX;
    const y = clickY - offsetY - Map.mapCenterY;

    //  https://www.redblobgames.com/grids/hexagons/#pixel-to-hex

    const tx = ((Math.sqrt(3) / 3) * x - (1 / 3) * y) / (this.tileR * Map.dist);
    const ty = ((2 / 3) * y) / (this.tileR * Map.dist);

    //  The limitation of this approach is that the most upper and bottom part of the hex (1/4) is considered to belong to another raw
    //  Needs to be addressed later

    return { x: Math.round(tx), y: Math.round(ty) };
  }

  //  calculates the pixels' coordinates for the tile based on its cartesians map coordinates
  getTileCenterCoordinates(
    tileX: number,
    tileY: number,
    offsetX: number,
    offsetY: number
  ): { x: number; y: number } {
    //  https://www.redblobgames.com/grids/hexagons/#hex-to-pixel
    const cx =
      offsetX +
      Map.mapCenterX +
      (Math.sqrt(3) * tileX + (Math.sqrt(3) * tileY) / 2) *
        (this.tileR * Map.dist);
    const cy =
      offsetY +
      Map.mapCenterY +
      tileY * (this.tileR * Map.dist) * Map.tileHorizontalShift;

    //  empirical
    // const cx =
    //   offsetX + Map.mapCenterX + (tileX + tileY / 2) * Map.tileW * Map.dist;
    // const cy =
    //   offsetY +
    //   Map.mapCenterY +
    //   tileY * (Map.tileR*Map.dist) * Map.tileHorizontalShift ;

    return { x: cx, y: cy };
  }

  private getTile(x: number, y: number): Tile {
    if (y < -this.mapRadius) {
      // console.warning('y (' + y + ') < -radius (' + -this._radius + ')');
      return undefined;
    }
    if (y > this.mapRadius) {
      // console.warning('y (' + y + ') > radius (' + this._radius + ')');
      return undefined;
    }

    const xMin = this.xMins[y + this.mapRadius];
    // console.log('y=' + y + ', xMin=' + xMin);
    if (x < xMin) {
      // console.warn('x (' + x + ') < xMin (' + xMin + ') for y=' + y);
      return undefined;
    }
    const xWidth = this.xWidths[y + this.mapRadius];
    if (x > xMin + xWidth) {
      // console.warn('x (' + x + ') > xWidth (' + xWidth + ') for y=' + y);
      return undefined;
    }
    const raw = this.tiles[y + this.mapRadius];
    const tile = raw[x - xMin];

    return tile;
  }

  hoverTile(x: number, y: number) {
    if (this.lastHovered !== undefined) {
      this.lastHovered.setHovered(false);
    }

    this.lastHovered = this.getTile(x, y);
    if (this.lastHovered !== undefined) {
      this.lastHovered.setHovered(true);
    }
  }

  private defineSizing() {
    this.tileHalfW = this.tileR * 0.866;
    this.tileW = this.tileHalfW * 2;
  }

  changeTileRadius(delta: number): number {
    this.tileR += delta;
    this.defineSizing();

    return this.tileR;
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

    // //region draw rectangle in tile
    // this.ctx.beginPath();
    // this.ctx.moveTo(cx, cy - radius);
    // this.ctx.lineTo(cx, cy + radius);
    // this.ctx.stroke();
    // this.ctx.beginPath();
    // this.ctx.moveTo(cx - halfWidth, cy);
    // this.ctx.lineTo(cx + halfWidth, cy);
    // this.ctx.stroke();
    // this.ctx.beginPath();
    // this.ctx.moveTo(cx + halfWidth, cy - radius / 2);
    // this.ctx.lineTo(cx - halfWidth, cy - radius / 2);
    // this.ctx.stroke();
    // this.ctx.beginPath();
    // this.ctx.moveTo(cx + halfWidth, cy + radius / 2);
    // this.ctx.lineTo(cx - halfWidth, cy + radius / 2);
    // this.ctx.stroke();
    // //endregion

    //region draw X in tile
    // this.ctx.beginPath();
    // this.ctx.moveTo(cx - halfWidth, cy);
    // this.ctx.lineTo(cx + halfWidth, cy);
    // this.ctx.stroke();
    // this.ctx.beginPath();
    // this.ctx.moveTo(cx + halfWidth / 2, cy - (radius * 3) / 4);
    // this.ctx.lineTo(cx - halfWidth / 2, cy + (radius * 3) / 4);
    // this.ctx.stroke();
    // this.ctx.beginPath();
    // this.ctx.moveTo(cx + halfWidth / 2, cy + (radius * 3) / 4);
    // this.ctx.lineTo(cx - halfWidth / 2, cy - (radius * 3) / 4);
    // this.ctx.stroke();
    //endregion

    //region draw *
    // this.ctx.beginPath();
    // this.ctx.moveTo(cx, cy - radius);
    // this.ctx.lineTo(cx, cy + radius);
    // this.ctx.stroke();
    // this.ctx.beginPath();
    // this.ctx.moveTo(cx + halfWidth, cy - radius / 2);
    // this.ctx.lineTo(cx - halfWidth, cy + radius / 2);
    // this.ctx.stroke();
    // this.ctx.beginPath();
    // this.ctx.moveTo(cx + halfWidth, cy + radius / 2);
    // this.ctx.lineTo(cx - halfWidth, cy - radius / 2);
    // this.ctx.stroke();
  }

  private drawTile(tile: Tile, offsetX: number, offsetY: number): void {
    const center = this.getTileCenterCoordinates(
      tile.getX(),
      tile.getY(),
      offsetX,
      offsetY
    );
    const terrain = tile.getTerrain(); // !== undefined ? tile.getTerrain() : tile[2];
    const color = Map.GetTerrainColor(terrain);

    if (tile.isHovered()) {
      this.drawHex(
        center.x,
        center.y,
        this.tileR + 2,
        color.fill,
        color.stroke,
        1
      );
    }

    this.drawHex(center.x, center.y, this.tileR, color.fill, color.stroke, 1);

    const resource = tile.getResource(); // !== undefined ? tile.resource : tile[3];
    if (resource !== undefined && resource !== '') {
      this.drawHex(
        center.x,
        center.y,
        this.tileR / 2,
        color.fill,
        color.stroke,
        2
      );
    }

    // this.ctx.font = '12px Arial';
    // this.ctx.textBaseline = 'hanging';
    // const text = `(${tile.getX()},${tile.getY()})`;
    // const measure = this.ctx.measureText(text);
    // this.ctx.lineWidth = 1;
    // this.ctx.strokeText(
    //   text,
    //   center.x - measure.actualBoundingBoxRight / 2,
    //   center.y - measure.actualBoundingBoxDescent / 2
    // );
  }

  drawMap(offsetX: number, offsetY: number): void {
    const mapRadius = 2 * this.mapRadius;

    for (let y = -mapRadius; y <= mapRadius; y++) {
      for (let x = -mapRadius; x <= mapRadius; x++) {
        const tile = this.getTile(x, y);
        // console.log('x=' + x + ', y=' + y + ': tile is ' + (tile !== undefined ? tile.terrain : 'undefined'));
        if (tile !== undefined) {
          this.drawTile(tile, offsetX, offsetY);
        }
      }
    }
  }

  private lastHovered: Tile;
}
