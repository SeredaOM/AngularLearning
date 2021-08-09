import { IObjectWasChanged } from '../common/IObjectWasChanged';
import { TileModel } from '../Models/TileModel';

export class Tile {
  private _terrain: string;
  public get terrain(): string {
    return this._terrain;
  }
  public set terrain(value: string) {
    console.log(
      `Tile (${this.getX()},${this.getY()}): Terrain has changed from ${
        this._terrain
      } to ${value}`
    );
    this._terrain = value;
    this.setIsModified();
  }

  constructor(
    private parent: IObjectWasChanged,
    private x: number,
    private y: number,
    terrain: string,
    private resource: string
  ) {
    this._terrain = terrain;
    this._isModified = false;
  }

  generateModel() {
    return new TileModel(this.x, this.y, this.terrain, this.resource);
  }

  private _isModified: boolean;
  private setIsModified() {
    this._isModified = true;
    this.parent.dataWereChanged();
  }
  isModified(): boolean {
    return this._isModified;
  }

  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }

  setX(newX: number) {
    this.x = newX;
    this.setIsModified();
  }
  setY(newY: number) {
    this.y = newY;
    this.setIsModified();
  }

  getResource() {
    return this.resource;
  }

  setHovered(hovered) {
    this.hovered = hovered;
  }

  isHovered() {
    return this.hovered;
  }

  public static getTerrainTypes() {
    return [
      'Invalid',
      'Water',
      'Desert',
      'Swamp',
      'Plain',
      'Hill',
      'Mountain',
      'Snow',
    ];
  }

  public static getEmptyTile() {
    return new Tile(null, 1, 1, Tile.getTerrainTypes()[0].toLowerCase(), '');
  }

  private hovered = false;
}
