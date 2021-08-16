import { TileModel } from './TileModel';

export class MapModel {
  constructor(
    public id: number,
    public name: string,
    public yMin: number,
    public xMins: Array<number>,
    public xWidths: Array<number>,
    public tiles: Array<Array<TileModel>>
  ) {}
}
