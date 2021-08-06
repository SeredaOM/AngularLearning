export class Tile {
  constructor(
    private x,
    private y,
    private terrain: string,
    private resource: string
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

  public static getTerrainTypes() {
    return ['Water', 'Desert', 'Swamp', 'Plain', 'Hill', 'Mountain', 'Snow'];
  }

  private hovered = false;
}
