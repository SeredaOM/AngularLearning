import { IObjectWasChanged } from '../common/IObjectWasChanged';
import { TileModel } from '../Models/TileModel';

export class Tile {
  private _terrain: string;
  public get terrain(): string {
    return this._terrain;
  }
  public set terrain(value: string) {
    this._terrain = value;
    this.setIsModified();
  }
  private _resource: string;
  public get resource(): string {
    return this._resource;
  }
  public set resource(value: string) {
    this._resource = value;
    this.setIsModified();
  }

  public hovered = false;
  public selected = false;

  constructor(
    private parent: IObjectWasChanged,
    private x: number,
    private y: number,
    terrain: string,
    resource: string,
    isModified: boolean = false
  ) {
    this._terrain = terrain;
    this._resource = resource;
    this._isModified = isModified;
  }

  generateModel() {
    const resource =
      this.resource == undefined || this.resource == null || this.resource == '' || this.resource == Tile._resourceNone
        ? null
        : this.resource;
    return new TileModel(this.x, this.y, this.terrain, resource);
  }

  private _isModified: boolean;
  private setIsModified() {
    this._isModified = true;
    this.parent.dataWereChanged();
  }
  resetIsModified() {
    this._isModified = false;
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

  isOnMap(): Boolean {
    return this.parent != null;
  }

  public static getTerrainTypes() {
    return this._terrains;
  }

  public static getEmptyTile() {
    return new Tile(null, 1, 1, Tile.getTerrainTypes()[0].toLowerCase(), '');
  }

  public static _resources = ['None', 'Settlement', 'Gold'];

  public static _resourceNone = Tile._resources[0].toLocaleLowerCase();

  public static _terrains = ['Empty', 'Water', 'Desert', 'Swamp', 'Plain', 'Hill', 'Mountain', 'Snow'];
}
