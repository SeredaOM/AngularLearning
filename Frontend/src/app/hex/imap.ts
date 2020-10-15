import { ITile } from './itile';

export class IMap {
    id: number;
    name: string;
    radius: number;
    tiles: Array<Array<ITile>>;
    xMins: Array<number>;
    xWidths: Array<number>;
}
