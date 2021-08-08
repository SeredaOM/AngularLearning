export class TileModel {
  x: number;
  y: number;
  terrain: string;
  resource: string;

  constructor(x: number, y: number, terrain: string, resource: string) {
    this.x = x;
    this.y = y;
    this.terrain = terrain;
    this.resource = resource;
  }
}
