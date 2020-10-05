import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HexesService } from './hexes.service';

import { Hex } from './hex';
import { Map } from './map';
import { Tile } from './tile';

@Component({
  selector: 'app-hex',
  templateUrl: './hex.component.html',
  styleUrls: ['./hex.component.css'],
})
export class HexComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  constructor(
    private cookieService: CookieService,
    private hexesService: HexesService
  ) {}

  private ctx: CanvasRenderingContext2D;
  private map: Map;
  private mapOffsetX = 0;
  private mapOffsetY = 0;
  private mapDragModeOn = false;
  private mapDragLastOffsetX = 0;
  private mapDragLastOffsetY = 0;

  private squares = new Array();

  canvasAction = '';

  ngOnInit(): void {
    this.hexesService.get().subscribe((data: any[]) => {
      console.log(data);
    });

    this.ctx = this.canvas.nativeElement.getContext('2d');
    let tileRadius = parseInt(this.cookieService.get('tileRadius'));
    if (tileRadius === undefined) {
      tileRadius = 30;
    }

    this.map = new Map(this.ctx, 15, tileRadius);

    this.animate();
  }

  //region CanvasEvents

  onCanvasMouseClick(event: MouseEvent): void {
    this.canvasAction = 'click, ' + this.canvasAction;
  }

  onCanvasMouseMove(event: MouseEvent): void {
    const tileCoords = this.map.getTileCoordinates(
      event.offsetX,
      event.offsetY,
      this.mapOffsetX,
      this.mapOffsetY
    );
    this.canvasAction = `Move on: mouse:(${event.offsetX},${event.offsetY}), tile: (${tileCoords.x},${tileCoords.y})`;

    // console.log(
    //   `MouseMove: mouse:(${event.offsetX},${event.offsetY}), tile: (${tileCoords.x},${tileCoords.y}), offset=(${this.mapOffsetX}, ${this.mapOffsetY}))`
    // );

    if (this.mapDragModeOn) {
      this.mapOffsetX += event.offsetX - this.mapDragLastOffsetX;
      this.mapOffsetY += event.offsetY - this.mapDragLastOffsetY;

      this.mapDragLastOffsetX = event.offsetX;
      this.mapDragLastOffsetY = event.offsetY;
    }

    this.map.hoverTile(tileCoords.x, tileCoords.y);
  }

  onCanvasMouseDown(event: MouseEvent): void {
    this.canvasAction = 'down';

    this.mapDragModeOn = true;
    this.mapDragLastOffsetX = event.offsetX;
    this.mapDragLastOffsetY = event.offsetY;
  }

  onCanvasMouseUp(): void {
    this.canvasAction = 'up';

    this.mapDragModeOn = false;
  }

  onCanvasMouseWheel(event: WheelEvent): void {
    const newTileRadius = this.map.changeTileRadius(-Math.sign(event.deltaY));
    this.cookieService.set('tileRadius', newTileRadius.toString());

    this.canvasAction = `wheel: x=${event.deltaX}, y=${event.deltaY}, z=${event.deltaZ}. NewTileRadius: ${newTileRadius}`;
  }

  //endregion

  addHex(): void {
    this.squares.push(new Hex(this.ctx));
  }

  protected animate(): void {
    // console.log("render called");

    requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.font = 'italic bold 48px serif';
    this.ctx.textBaseline = 'hanging';
    const text = 'Hello world';
    const measure = this.ctx.measureText(text);
    // console.log(measure);
    this.ctx.strokeText(
      text,
      this.ctx.canvas.width - measure.actualBoundingBoxRight,
      this.ctx.canvas.height - measure.actualBoundingBoxDescent - 10
    );

    this.squares.forEach((hex: Hex) => {
      hex.moveRight();
    });

    this.map.drawMap(this.mapOffsetX, this.mapOffsetY);
  }
}
