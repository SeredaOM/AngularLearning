import { IObjectWasChanged } from '../common/IObjectWasChanged';
import { MapModel } from '../Models/MapModel';
import { TileModel } from '../Models/TileModel';
import { Tile } from './tile';

export class Map implements IObjectWasChanged {
  //  Pixel coordinates of the (0,0) tile on the maps
  private static readonly mapCenterX = 250;
  private static readonly mapCenterY = 200;
  private tileR: number;
  private tileW: number;
  private static readonly dist = 1.1; //  distance between tiles is 10% of the tile width
  private static readonly tileHorizontalShift = 1.5;

  private tiles: Array<Array<Tile>>;
  /* #region  Construction */

  constructor(
    private parent: IObjectWasChanged,
    private ctx: CanvasRenderingContext2D,
    public id: number,
    public name: string,
    tileRadius: number,
    private yMin: number,
    private xMins: Array<number>,
    private xWidths: Array<number>
  ) {
    this.tileR = tileRadius;
    this.updateCanvasFont();
    this.tileW = Map.getTileWidth(this.tileR);

    this.yMin = yMin;
    this.xMins = xMins;
    this.xWidths = xWidths;

    this._isModified = false;
  }

  generateModelsForModifiedTiles(): TileModel[] {
    let tileModels = [];
    this.tiles.forEach((_tiles) => {
      _tiles.forEach((tile) => {
        if (tile != undefined && tile.isModified()) {
          tileModels.push(tile.generateModel());
        }
      });
    });

    return tileModels;
  }

  /* #endregion */

  public assignTiles(tiles: Array<Array<Tile>>) {
    this.tiles = tiles;
  }

  private _isModified: boolean;
  private setIsModified() {
    this._isModified = true;
    this.parent.dataWereChanged();
  }
  isModified(): boolean {
    return this._isModified;
  }

  dataWereChanged() {
    this.setIsModified();
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

      case 'hill':
        colorFill = '#00C000';
        colorStroke = '#000000';
        break;

      case 'mountain':
        colorFill = '#888888';
        colorStroke = '#000000';
        break;

      case 'snow':
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

  addTile(tile: Tile) {
    if (tile.getY() < this.yMin) {
      this.yMin -= 1;
      tile.setY(this.yMin);

      this.xMins.unshift(tile.getX());
      this.xWidths.unshift(1);
      this.tiles.unshift([tile]);
    }
  }

  getTile(x: number, y: number): Tile {
    if (y < this.yMin) {
      // console.warning('y (' + y + ') < -radius (' + -this._radius + ')');
      return null;
    }
    if (y >= this.yMin + this.tiles.length) {
      // console.warning('y (' + y + ') > radius (' + this._radius + ')');
      return null;
    }

    var yIndex = y - this.yMin;
    const xMin = this.xMins[yIndex];
    // console.log('y=' + y + ', xMin=' + xMin);
    if (x < xMin) {
      // console.warn('x (' + x + ') < xMin (' + xMin + ') for y=' + y);
      return null;
    }
    const row = this.tiles[yIndex];
    const xWidth = row.length;
    if (x > xMin + xWidth) {
      // console.warn('x (' + x + ') > xWidth (' + xWidth + ') for y=' + y);
      return null;
    }
    const xIndex = x - xMin;
    const tile = row[xIndex];

    return tile;
  }

  hoverTile(x: number, y: number) {
    if (this.lastHovered != null) {
      this.lastHovered.setHovered(false);
    }

    this.lastHovered = this.getTile(x, y);
    if (this.lastHovered != null) {
      this.lastHovered.setHovered(true);
    }
  }

  static getTileWidth(tileR: number): number {
    return tileR * 0.866 * 2;
  }

  private updateCanvasFont() {
    let newFontSize: number = this.tileR;
    this.ctx.font = `${newFontSize}px Arial`;
  }

  changeTileRadius(delta: number): number {
    this.tileR += delta;
    this.tileW = Map.getTileWidth(this.tileR);

    this.updateCanvasFont();

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

    const color = Map.GetTerrainColor(tile.terrain);

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

    if (tile.isModified()) {
      this.ctx.strokeText('*', center.x, center.y);
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
    const yMin = this.yMin;
    const yMax = this.tiles.length + this.yMin;
    for (let y = yMin; y < yMax; y++) {
      const yIndex = y - yMin;
      const xMin = this.xMins[yIndex];
      const xMax = this.xWidths[yIndex] + xMin;
      for (let x = xMin; x < xMax; x++) {
        const tile = this.getTile(x, y);
        if (tile != null) {
          this.drawTile(tile, offsetX, offsetY);
        }
      }
    }
  }

  /* #endregion */

  private lastHovered: Tile;
}
