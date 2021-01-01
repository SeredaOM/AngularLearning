import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  isDevMode,
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HexesService } from './hexes.service';

import { Hex } from './hex';
import { ITile } from './itile';
import { Tile } from './tile';
import { IMap } from './imap';
import { Map } from './map';

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
  private offscreenCanvas: OffscreenCanvas;
  private map: Map;
  private mapOffsetX = 0;
  private mapOffsetY = 0;
  private mapDragModeOn = false;
  private mapDragLastOffsetX = 0;
  private mapDragLastOffsetY = 0;

  private squares = new Array();

  canvasAction = '';
  animationTime = 0;

  private UpdateGreeting(greeting: string) {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.offscreenCanvas = new OffscreenCanvas(256, 256);
    this.offscreenCanvas.width = this.ctx.canvas.width;
    this.offscreenCanvas.height = this.ctx.canvas.height;

    let ctxOS = this.offscreenCanvas.getContext('2d');
    ctxOS.font = 'italic bold 48px serif';
    ctxOS.textBaseline = 'hanging';
    const text = greeting + (isDevMode() ? ' (DevMode: ON)' : '');
    const measure = ctxOS.measureText(text);
    ctxOS.strokeText(
      text,
      ctxOS.canvas.width - measure.actualBoundingBoxRight,
      ctxOS.canvas.height - measure.actualBoundingBoxDescent - 10
    );
  }

  ngOnInit(): void {
    this.UpdateGreeting('Hello World!!!');
    this.map = undefined;

    this.hexesService.get().subscribe((mapData: IMap) => {
      console.log('Get: ');
      console.log(mapData);

      let tileRadius = parseInt(this.cookieService.get('tileRadius'));
      if (isNaN(tileRadius)) {
        tileRadius = 30;
        this.cookieService.set('tileRadius', tileRadius.toString());
      }
      //this.map = <Map>mapData;

      let tiles = new Array<Array<Tile>>();
      mapData.tiles.forEach((rowTilesData) => {
        let rowTiles = new Array<Tile>();
        rowTilesData.forEach((tileData) => {
          const tile = new Tile(
            tileData.x,
            tileData.y,
            tileData.terrain.toLocaleLowerCase(),
            tileData.resource == undefined || tileData.resource == 'null'
              ? undefined
              : tileData.resource.toLocaleLowerCase()
          );
          rowTiles.push(tile);
          tile.getTerrain();
        });
        tiles.push(rowTiles);
      });

      this.map = new Map(
        this.ctx,
        mapData.name,
        mapData.radius,
        tileRadius,
        tiles,
        mapData.xMins,
        mapData.xWidths
      );

      this.UpdateGreeting(`Map: ${this.map.name}`);
    });

    this.animate();
  }

  /* #region CanvasEvents */

  onCanvasMouseClick(event: MouseEvent): void {
    this.canvasAction = 'click, ' + this.canvasAction;
  }

  onCanvasMouseMove(event: MouseEvent): void {
    if (this.map === undefined) {
      console.log(`Map is not defined`);
      return;
    }

    const tileCoords = this.map.getTileCoordinates(
      event.offsetX,
      event.offsetY,
      this.mapOffsetX,
      this.mapOffsetY
    );
    if (isNaN(tileCoords.x) || isNaN(tileCoords.y)) {
      console.log(
        `Can't identify tile on mouse move (${event.offsetX},${event.offsetY})`
      );

      const tileCoords = this.map.getTileCoordinates(
        event.offsetX,
        event.offsetY,
        this.mapOffsetX,
        this.mapOffsetY
      );

      return;
    }

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

  /* #endregion */

  addHex(): void {
    this.squares.push(new Hex(this.ctx));
  }

  protected animate(): void {
    // console.log("render called");
    var t0 = performance.now();

    requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.drawImage(this.offscreenCanvas, 0, 0);
    this.squares.forEach((hex: Hex) => {
      hex.moveRight();
    });

    if (this.map !== undefined) {
      this.map.drawMap(this.mapOffsetX, this.mapOffsetY);
    }
    var t1 = performance.now();
    this.animationTime = Math.floor((t1 - t0) * 10) / 10;
  }
}
