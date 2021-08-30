import { Component, ElementRef, EventEmitter, HostListener, isDevMode, OnInit, Output, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Alert } from '../common/Alert';
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
  @Output() mapNameChanged = new EventEmitter();

  @ViewChild('map', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  alerts: Alert[] = [];

  constructor(
    private cookieService: CookieService,
    private hexesService: HexesService,
    private route: ActivatedRoute
  ) {}

  private ctx: CanvasRenderingContext2D;
  private offscreenCanvas: OffscreenCanvas;
  public mapName: string = '';
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
  viewOnlyForSelectedTile: boolean = this.viewOnly;

  mapIsModified = false;
  selectedTile: Tile = Tile.getEmptyTile();

  tileRadius: number = NaN;
  defaultTerrain: string = null;

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
    const text = greeting + (isDevMode() ? ' (DevMode: ON)' : '') + (this.viewOnly ? ', view only' : '');
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

    this.map = new Map(this, this.ctx, mapModel, this.tileRadius);

    this.mapName = mapModel.name;
    this.dataWereChanged();
    this.UpdateGreeting(`Map: ${this.mapName}`);
  }

  private loadSettingsFromCookies() {
    this.tileRadius = parseInt(this.cookieService.get(HexComponent.cookieNameTileRadius));
    if (isNaN(this.tileRadius)) {
      this.tileRadius = 30;
      this.cookieService.set(HexComponent.cookieNameTileRadius, this.tileRadius.toString());
    }

    this.defaultTerrain = this.cookieService.get(HexComponent.cookieNameDefaultTerrain);
    if (this.defaultTerrain == null || this.defaultTerrain == '') {
      this.defaultTerrain = Tile.getTerrainTypes()[0].toLowerCase();
      this.cookieService.set(HexComponent.cookieNameDefaultTerrain, this.defaultTerrain);
    }
  }

  ngOnInit(): void {
    this.changeCanvasSize();
    this.UpdateGreeting(`Hello hex (mapId to be identified)!!!`);

    this.loadSettingsFromCookies();

    this.map = undefined;
    this.animate();

    //this.mapId = this.route.snapshot.paramMap.get('mapId');
    let _this = this;
    this.route.queryParams.subscribe((params) => {
      _this.mapId = Number(params['mapId']);
      _this.UpdateGreeting(`Hello hex (mapId=${this.mapId})!!!`);

      if (_this.mapId != undefined && !isNaN(_this.mapId) && _this.mapId != 0) {
        _this.hexesService.getMap(_this.mapId).subscribe((mapData: MapModel) => this.handleNewMap(mapData));
      }
    });
  }

  onMapNameChange(event) {
    if (this.map != null) {
      this.map.name = this.mapName;
      this.dataWereChanged();
    }
  }

  /* #region CanvasEvents */

  changeCanvasSize() {
    this.canvas.nativeElement.width = window.innerWidth - 12;
    this.canvas.nativeElement.height = window.innerHeight - 300;
  }
  @HostListener('window:resize', ['$event'])
  onResize = function () {
    this.changeCanvasSize();
  };
  @HostListener('window:load', ['$event'])
  onLoad = function () {
    this.changeCanvasSize();
  };

  handleCommonCanvaseMouseClick(event: MouseEvent): { x: number; y: number } {
    if (this.mapDragModeOn) {
      this.mapDragModeOn = false;
      return null;
    } else {
      const tileCoords = this.map.getTileCoordinates(event.offsetX, event.offsetY, this.mapOffsetX, this.mapOffsetY);
      return tileCoords;
    }
  }

  onCanvasMouseClick(event: MouseEvent): void {
    let tileCoords = this.handleCommonCanvaseMouseClick(event);
    if (tileCoords != null) {
      let tile = this.map.getTile(tileCoords.x, tileCoords.y);
      if (tile == null && !this.viewOnly) {
        tile = new Tile(this.map, tileCoords.x, tileCoords.y, this.defaultTerrain, null, true);
        this.map.addTile(tile);
      }
      if (tile != null) {
        this.selectTile(tile);
      }
    }

    this.canvasAction = 'click, ' + this.canvasAction;
  }

  onCanvasRightClick(event: MouseEvent): Boolean {
    let tileCoords = this.handleCommonCanvaseMouseClick(event);
    if (tileCoords != null && !this.viewOnly) {
      let tile = new Tile(this.map, tileCoords.x, tileCoords.y, this.defaultTerrain, null, true);
      this.map.addTile(tile);
      this.selectTile(tile);
    }

    return false;
  }

  private selectTile(tile: Tile) {
    this.selectedTile = tile;
    this.viewOnlyForSelectedTile = this.viewOnly;
    this.map.selectTile(tile);
  }

  onCanvasMouseMove(event: MouseEvent): void {
    if (this.map === undefined) {
      console.log(`Map is not defined`);
      return;
    }

    const tileCoords = this.map.getTileCoordinates(event.offsetX, event.offsetY, this.mapOffsetX, this.mapOffsetY);
    if (isNaN(tileCoords.x) || isNaN(tileCoords.y)) {
      console.log(`Can't identify tile on mouse move (${event.offsetX},${event.offsetY})`);

      const tileCoords = this.map.getTileCoordinates(event.offsetX, event.offsetY, this.mapOffsetX, this.mapOffsetY);

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

  onCanvasMouseUp(event: MouseEvent): void {
    this.canvasAction = 'up';
    this.mapMouseDown = false;
  }

  onCanvasMouseWheel(event: WheelEvent): Boolean {
    if (this.map == null) {
      return true;
    }

    const newTileRadius = this.map.changeTileRadius(-Math.sign(event.deltaY));
    this.tileRadius = newTileRadius;
    this.cookieService.set('tileRadius', newTileRadius.toString());

    this.canvasAction = `wheel: x=${event.deltaX}, y=${event.deltaY}, z=${event.deltaZ}. NewTileRadius: ${newTileRadius}`;

    return false;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    let key = Number(event.key);
    if (isNaN(key)) {
      if (event.ctrlKey) {
        if (event.code == 'KeyS') {
          this.saveMap();
          return false;
        }
        //console.log(event);
      }
    } else {
      if (!this.viewOnly) {
        const terrains = Tile.getTerrainTypes();
        if (key < terrains.length) {
          const newTerrain = terrains[key].toLowerCase();
          if (event.ctrlKey) {
            this.defaultTerrain = newTerrain;
            return false;
          } else {
            if (this.selectedTile.isOnMap()) {
              this.selectedTile.terrain = newTerrain;
              return false;
            }
          }
        }
      }
    }

    return true;
  }

  onDeffaultTerrainSelectionChange(value) {
    this.cookieService.set(HexComponent.cookieNameDefaultTerrain, value);
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
    this.hexesService.getMap(mapId).subscribe((mapData: MapModel) => this.handleNewMap(mapData));
  }

  saveMap(): void {
    console.log(`saving map...`);
    let mapModel = this.map.generateModel();
    this.hexesService
      .saveMapTiles(this.map.id, mapModel)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const alert = new Alert(Alert.AlertType.danger, `Could not save the map. Try again or contact support.`);
          this.alerts.push(alert);

          setTimeout(() => {
            this.close(alert);
          }, Alert.DangerTimeout);

          console.log(`Error saving map: ${error.error.detail}`);
          console.log(error);
          return throwError(`Could not save the map. Try again or contact support.`);
        })
      )
      .subscribe((id: number) => {
        if (this.map.id == id) {
          this.map.resetIsModified();
        }

        const alert = new Alert(Alert.AlertType.success, `Map changes were saved successfully`);
        this.alerts.push(alert);

        setTimeout(() => {
          this.close(alert);
        }, Alert.SuccessTimeout);

        this.mapNameChanged.emit();
      });
  }

  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
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

  private static get cookieNameTileRadius() {
    return 'tileRadius';
  }
  private static get cookieNameDefaultTerrain() {
    return 'defaultTerrain';
  }
}
