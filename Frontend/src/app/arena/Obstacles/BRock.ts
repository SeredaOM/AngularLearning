import { Rock } from './Rock';

export class NormalRock extends Rock {
  constructor(
    public ctx: CanvasRenderingContext2D,
    public x: number,
    public y: number,
    public name: string
  ) {
    super(ctx, x, y, name, 35);
  }

  protected getFillColor(): string {
    return '#c2c1be';
  }

  protected getStrokeColor(): string {
    return '#a6a5a2';
  }
}

export class BRock extends Rock {
  constructor(
    public ctx: CanvasRenderingContext2D,
    public x: number,
    public y: number,
    public name: string
  ) {
    super(ctx, x, y, name, 135);
  }

  protected getFillColor(): string {
    return '#92918e';
  }

  protected getStrokeColor(): string {
    return '#767572';
  }
}
