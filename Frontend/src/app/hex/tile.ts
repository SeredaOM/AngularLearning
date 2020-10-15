export class Tile {
  constructor(
    public x,
    public y,
    public terrain: string,
    public resource: string
  ) {}

  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getTerrain() {
    return this.terrain;
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

  private hovered = false;
}
