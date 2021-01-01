import { Tile } from './tile';

export class Map {
  //  Pixel coordinates of the (0,0) tile on the maps
  private static readonly mapCenterX = 250;
  private static readonly mapCenterY = 200;
  private tileR = 30;
  private tileW: number;
  private static readonly dist = 1.1; //  distance between tiles is 10% of the tile width
  private static readonly tileHorizontalShift = 1.5;

  /* #region  Construction */

  constructor(
    private ctx: CanvasRenderingContext2D,
    public name: string,
    radius: number,
    tileRadius: number,
    private tiles: Array<Array<Tile>>,
    private xMins: Array<number>,
    private xWidths: Array<number>
  ) {
    this.radius = radius;

    this.tileR = tileRadius;
    this.tileW = Map.getTileWidth(this.tileR);

    this.tiles = tiles;
    this.xMins = xMins;
    this.xWidths = xWidths;
  }

  /* #endregion */

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

      case 'mountain':
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

  hoverTile(x: number, y: number) {
    if (this.lastHovered !== undefined) {
      this.lastHovered.setHovered(false);
    }

    this.lastHovered = this.getTile(x, y);
    if (this.lastHovered !== undefined) {
      this.lastHovered.setHovered(true);
    }
  }

  static getTileWidth(tileR: number): number {
    return tileR * 0.866 * 2;
  }

  getMapRadius(): number {
    return this.radius;
  }

  setTileRadius(tileRadius: number) {
    this.tileR = tileRadius;
  }

  changeTileRadius(delta: number): number {
    this.tileR += delta;
    this.tileW = Map.getTileWidth(this.tileR);

    return this.tileR;
  }

  /* #region Drawing */

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

    if (
      center.x < 0 - this.tileW ||
      center.x > this.ctx.canvas.width + this.tileW ||
      center.y < 0 - this.tileR ||
      center.y > this.ctx.canvas.height + this.tileR
    ) {
      return;
    }

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
    const mapRadius = 2 * this.radius;

    for (let y = -mapRadius; y <= mapRadius; y++) {
      for (let x = -mapRadius; x <= mapRadius; x++) {
        const tile = this.getTile(x, y);
        //console.log(`x=${x}, y=${y}: tile is ` + (tile !== undefined ? tile.terrain : 'undefined'));
        if (tile !== undefined) {
          this.drawTile(tile, offsetX, offsetY);
        }
      }
    }
  }

  /* #endregion */

  public id: number;
  public radius: number;

  private lastHovered: Tile;
}
