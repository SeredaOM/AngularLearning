export class Tile {
    constructor(private x, private y, private terrain: string, private resource: string) { }

    getX() { return this.x; }
    getY() { return this.y; }
    getTerrain() { return this.terrain; }
    getResource() { return this.resource; }
}