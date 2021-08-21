export class ScalableImage {
  public static get BaselineSize() {
    return 30;
  }

  constructor(path: string) {
    this.img = new Image();
    this.img.src = path;
  }

  public updateFactors(newSize) {
    this.size = newSize;
    this.factorX = (this.img.width * newSize) / ScalableImage.BaselineSize;
    this.factorY = (this.img.height * newSize) / ScalableImage.BaselineSize;
  }

  public draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.drawImage(this.img, x - this.factorX / 2, y - this.factorY / 2 + this.size / 3, this.factorX, this.factorY);
  }

  private img: HTMLImageElement;
  private size: number;
  private factorX: number;
  private factorY: number;
}
