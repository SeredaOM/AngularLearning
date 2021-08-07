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

  public serialize(): string {
    let res =
      this.resource === undefined || this.resource === ''
        ? 'null'
        : `"${this.resource}"`;
    return `{"x":${this.x},"y":${this.y},"terrain":"${this.terrain}","resource":${res}}`;
  }
}
