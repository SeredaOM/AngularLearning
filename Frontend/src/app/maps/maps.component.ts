import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { HexComponent } from '../hex/hex.component';
import { HexesService } from '../hex/hexes.service';
import { IMapDescription } from '../ServiceData/MapDescription';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
})
export class MapsComponent implements OnInit {
  @ViewChild(HexComponent) hexComponent: HexComponent;

  public mapDescriptions: IMapDescription[];

  constructor(public ngZone: NgZone, private hexesService: HexesService) {}

  ngOnInit(): void {
    this.hexesService
      .getMapDataAvailableForPlayer(1)
      .subscribe((mapDescriptions: any) => this.handleNewMap(mapDescriptions));
  }

  loadMap(mapId): void {
    this.hexComponent.loadMap(mapId);
  }

  handleNewMap(mapDescriptions: IMapDescription[]): void {
    this.ngZone.run(() => {
      this.mapDescriptions = mapDescriptions;
    });

    console.log(mapDescriptions);
    mapDescriptions.forEach((mapDescription) => {
      console.log(mapDescription);
    });
  }
}
