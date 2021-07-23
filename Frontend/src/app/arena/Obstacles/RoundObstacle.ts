export abstract class RoundObstacle {
  constructor(public x: number, public y: number, public radius: number) {}

  public abstract draw(viewX: number, viewY: number);
}
