import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  isDevMode,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { IObjectWasChanged } from '../common/IObjectWasChanged';
import { HexesService } from './hexes.service';

import { Hex } from './hex';
import { TileModel } from '../Models/TileModel';
import { Tile } from './tile';
import { MapModel } from '../Models/MapModel';
import { Map } from './map';

@Component({
  selector: 'app-hex',
  templateUrl: './hex.component.html',
  styleUrls: ['./hex.component.css'],
})
export class HexComponent implements OnInit, IObjectWasChanged {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  constructor(
    private cookieService: CookieService,
    private hexesService: HexesService,
    private route: ActivatedRoute
  ) {}

  private ctx: CanvasRenderingContext2D;
  private offscreenCanvas: OffscreenCanvas;
  private map: Map;
  private mapOffsetX = 0;
  private mapOffsetY = 0;
  private mapDragModeOn = false;
  private mapDragLastOffsetX = 0;
  private mapDragLastOffsetY = 0;
  private mapMouseDown = false;

  private squares = new Array();

  private mapId: number = 0;
  viewOnly: boolean = true;

  mapIsModified = false;
  selectedTile = Tile.getEmptyTile();
  defaultTerrain = Tile.getTerrainTypes()[0].toLowerCase();

  canvasAction = '';
  animationTime = 0;

  dataWereChanged() {
    this.mapIsModified = this.map.isModified();
  }

  private UpdateGreeting(greeting: string) {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.offscreenCanvas = new OffscreenCanvas(256, 256);
    this.offscreenCanvas.width = this.ctx.canvas.width;
    this.offscreenCanvas.height = this.ctx.canvas.height;

    let ctxOS = this.offscreenCanvas.getContext('2d');
    ctxOS.font = 'italic bold 48px serif';
    ctxOS.textBaseline = 'hanging';
    const text =
      greeting +
      (isDevMode() ? ' (DevMode: ON)' : '') +
      (this.viewOnly ? ', view only' : '');
    const measure = ctxOS.measureText(text);
    ctxOS.strokeText(
      text,
      ctxOS.canvas.width - measure.actualBoundingBoxRight,
      ctxOS.canvas.height - measure.actualBoundingBoxDescent - 10
    );
  }

  private handleNewMap(mapModel: MapModel): void {
    console.log('Get: ');
    console.log(mapModel);

    this.selectedTile = Tile.getEmptyTile();

    let tileRadius = parseInt(this.cookieService.get('tileRadius'));
    if (isNaN(tileRadius)) {
      tileRadius = 30;
      this.cookieService.set('tileRadius', tileRadius.toString());
    }

    this.map = new Map(this, this.ctx, mapModel, tileRadius);
    this.dataWereChanged();
    this.UpdateGreeting(`Map: ${this.map.name}`);
  }

  ngOnInit(): void {
    this.UpdateGreeting(`Hello hex (mapId to be identified)!!!`);

    this.map = undefined;
    this.animate();

    //this.mapId = this.route.snapshot.paramMap.get('mapId');
    let _this = this;
    this.route.queryParams.subscribe((params) => {
      _this.mapId = Number(params['mapId']);
      _this.UpdateGreeting(`Hello hex (mapId=${this.mapId})!!!`);

      if (_this.mapId != undefined && !isNaN(_this.mapId) && _this.mapId != 0) {
        _this.hexesService
          .getMap(_this.mapId)
          .subscribe((mapData: MapModel) => this.handleNewMap(mapData));
      }
    });
  }

  /* #region CanvasEvents */

  onCanvasMouseClick(event: MouseEvent): void {
    if (this.mapDragModeOn) {
      this.mapDragModeOn = false;
    } else {
      const tileCoords = this.map.getTileCoordinates(
        event.offsetX,
        event.offsetY,
        this.mapOffsetX,
        this.mapOffsetY
      );

      let title = this.map.getTile(tileCoords.x, tileCoords.y);
      if (title == null && !this.viewOnly) {
        title = new Tile(
          this.map,
          tileCoords.x,
          tileCoords.y,
          this.defaultTerrain,
          null,
          true
        );
        this.map.addTile(title);
      }
      if (title != null) {
        this.selectedTile = title;
      }
    }

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
    if (this.mapMouseDown) {
      if (!this.mapDragModeOn) {
        this.mapDragModeOn = true;
      }
    }

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

    this.mapMouseDown = true;
    this.mapDragLastOffsetX = event.offsetX;
    this.mapDragLastOffsetY = event.offsetY;
  }

  onCanvasMouseUp(): void {
    this.canvasAction = 'up';
    this.mapMouseDown = false;
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

  loadTestMap(): void {
    this.loadMap(1, true);
  }

  public loadMap(mapId: number, viewOnly: boolean): void {
    this.viewOnly = viewOnly;
    this.hexesService
      .getMap(mapId)
      .subscribe((mapData: MapModel) => this.handleNewMap(mapData));
  }

  saveMap(): void {
    console.log(`saving map...`);
    let tiles = this.map.generateModelsForModifiedTiles();
    this.hexesService
      .saveMapTiles(this.map.id, tiles)
      .subscribe((id: number) => {
        console.log(`PostMap id=${id}`);
      });
  }

  testPostRequest(): void {
    let tile = new TileModel(1, 25, 'snow', 'gold');
    this.hexesService.postTile(tile).subscribe((id: number) => {
      console.log(`PostTitle id=${id}`);
    });
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
