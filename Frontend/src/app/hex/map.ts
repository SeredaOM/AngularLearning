import { IObjectWasChanged } from '../common/IObjectWasChanged';
import { ScalableImage } from '../common/ScalableImage';
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
  private tileStrokeWidth: number;

  private tiles: Array<Array<Tile>>;
  /* #region  Construction */

  public id: number;
  public name: string;
  private yMin: number;
  private xMins: Array<number>;
  private xWidths: Array<number>;

  constructor(
    private parent: IObjectWasChanged,
    private ctx: CanvasRenderingContext2D,
    mapModel: MapModel,
    tileRadius: number
  ) {
    this.id = mapModel.id;
    this.name = mapModel.name;

    this.yMin = mapModel.yMin;
    this.xMins = mapModel.xMins;
    this.xWidths = mapModel.xWidths;

    this.tiles = this.parseModelTiles(mapModel.tiles);

    this.updateSizes(tileRadius);

    this._isModified = false;
  }

  public parseModelTiles(tilesModels: TileModel[][]): Array<Array<Tile>> {
    let tiles = new Array<Array<Tile>>();
    tilesModels.forEach((rowTilesData) => {
      let rowTiles = new Array<Tile>();
      rowTilesData.forEach((tileData) => {
        var tile: Tile;
        if (tileData == null) {
          tile = null;
        } else {
          tile = new Tile(
            this,
            tileData.x,
            tileData.y,
            tileData.terrain.toLocaleLowerCase(),
            tileData.resource == undefined || tileData.resource == 'null'
              ? undefined
              : tileData.resource.toLocaleLowerCase()
          );
        }
        rowTiles.push(tile);
      });
      tiles.push(rowTiles);
    });

    return tiles;
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
  resetIsModified() {
    this.tiles.forEach((_tiles) => {
      _tiles.forEach((tile) => {
        if (tile != undefined && tile.isModified()) {
          tile.resetIsModified();
        }
      });
    });
    this._isModified = false;
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
  getTileCoordinates(clickX: number, clickY: number, offsetX: number, offsetY: number): { x: number; y: number } {
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
  getTileCenterCoordinates(tileX: number, tileY: number, offsetX: number, offsetY: number): { x: number; y: number } {
    //  https://www.redblobgames.com/grids/hexagons/#hex-to-pixel
    const cx = offsetX + Map.mapCenterX + (Math.sqrt(3) * tileX + (Math.sqrt(3) * tileY) / 2) * (this.tileR * Map.dist);
    const cy = offsetY + Map.mapCenterY + tileY * (this.tileR * Map.dist) * Map.tileHorizontalShift;

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
    let x = tile.getX();
    let y = tile.getY();

    if (y < this.yMin) {
      this.addTileAbove(tile);
    } else if (y >= this.yMin + this.xMins.length) {
      this.addTileBelow(tile);
    } else {
      const yIndex = y - this.yMin;
      if (x < this.xMins[yIndex]) {
        this.addTileLeft(tile, yIndex);
      } else if (x >= this.xMins[yIndex] + this.xWidths[yIndex]) {
        this.addTileRight(tile, yIndex);
      } else {
        this.addTileInside(tile, yIndex);
      }
    }
    this.setIsModified();
  }

  private addTileAbove(tile: Tile) {
    this.yMin -= 1;
    this.xMins.unshift(tile.getX());
    this.xWidths.unshift(1);
    this.tiles.unshift([tile]);
    tile.setY(this.yMin);
  }

  private addTileBelow(tile: Tile) {
    this.xMins.push(tile.getX());
    this.xWidths.push(1);
    this.tiles.push([tile]);
    tile.setY(this.yMin + this.tiles.length - 1);
  }

  private addTileLeft(tile: Tile, yIndex: number) {
    this.xMins[yIndex]--;
    this.xWidths[yIndex]++;
    this.tiles[yIndex].unshift(tile);
    tile.setX(this.xMins[yIndex]);
  }

  private addTileRight(tile: Tile, yIndex: number) {
    this.xWidths[yIndex]++;
    this.tiles[yIndex].push(tile);
    tile.setX(this.xMins[yIndex] + this.xWidths[yIndex] - 1);
  }

  private addTileInside(tile: Tile, yIndex: number) {
    const currentTile = this.getTile(tile.getX(), tile.getY());
    this.tiles[yIndex][tile.getX() - this.xMins[yIndex]] = tile;
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
    let newTileRadius = this.tileR + delta;
    if (newTileRadius <= 1) {
      newTileRadius = 1;
    }
    if (newTileRadius >= 50) {
      newTileRadius = 50;
    }

    this.updateSizes(newTileRadius);

    return this.tileR;
  }

  public updateSizes(newTileRadius: number) {
    this.tileR = newTileRadius;
    this.tileW = Map.getTileWidth(this.tileR);
    this.tileStrokeWidth = (1.5 * this.tileR) / ScalableImage.BaselineSize;
    this.updateCanvasFont();

    Map.imgGold.updateFactors(this.tileR);
  }

  /* #region Drawing */

  drawHex(cx: number, cy: number, radius: number, fillColor: string, strokeColor: string, strokeWidth: number): void {
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
    const center = this.getTileCenterCoordinates(tile.getX(), tile.getY(), offsetX, offsetY);

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
      this.drawHex(center.x, center.y, this.tileR + 2, color.fill, color.stroke, this.tileStrokeWidth);
    }

    this.drawHex(center.x, center.y, this.tileR, color.fill, color.stroke, this.tileStrokeWidth);

    const resource = tile.getResource(); // !== undefined ? tile.resource : tile[3];
    if (resource != null && resource !== '') {
      const img = Map.images[resource];
      img.draw(this.ctx, center.x, center.y);
      this.drawHex(center.x, center.y, this.tileR / 2, color.fill, color.stroke, 2);
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

  private static imgGold: ScalableImage = new ScalableImage('../../assets/images/gold.svg');
  private static images = { gold: Map.imgGold };
}
