import { ITile } from './itile';

export class IMap {
    id: number;
    name: string;
    yMin: number;
    xMins: Array<number>;
    xWidths: Array<number>;
    tiles: Array<Array<ITile>>;
}