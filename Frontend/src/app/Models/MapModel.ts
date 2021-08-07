import { TileModel } from './TileModel';

export class MapModel {
  id: number;
  name: string;
  yMin: number;
  xMins: Array<number>;
  xWidths: Array<number>;
  tiles: Array<Array<TileModel>>;
}
