import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { HexComponent } from '../hex/hex.component';
import { HexesService } from '../hex/hexes.service';
import { IMapDescription } from '../Models/MapDescription';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
})
export class MapsComponent implements OnInit {
  @ViewChild(HexComponent) hexComponent: HexComponent;

  public mapDescriptions: IMapDescription[];
  public editMapId: number = 0;

  constructor(public ngZone: NgZone, private hexesService: HexesService) {}

  private loadMapsList() {
    this.hexesService
      .getMapDataAvailableForPlayer()
      .subscribe((mapDescriptions: IMapDescription[]) => this.handleNewMapData(mapDescriptions));
  }

  ngOnInit(): void {
    this.loadMapsList();
  }

  loadMap(mapId): void {
    this.editMapId = 0;
    this.hexComponent.loadMap(mapId, true);
  }

  editMapChange(event) {
    //  editMapId still has its old value (${this.editMapId}), use the event instead: ${event.value}`
    this.hexComponent.loadMap(event.value, false);
  }

  handleNewMapData(mapDescriptions: IMapDescription[]): void {
    this.ngZone.run(() => {
      this.mapDescriptions = mapDescriptions;
    });
  }

  onMapNameChange(event) {
    this.loadMapsList();
  }
}
