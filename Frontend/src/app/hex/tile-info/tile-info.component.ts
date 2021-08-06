import { Component, Input, OnInit } from '@angular/core';
import { Tile } from '../tile';

@Component({
  selector: 'app-tile-info',
  templateUrl: './tile-info.component.html',
  styleUrls: ['./tile-info.component.css'],
})
export class TileInfoComponent implements OnInit {
  @Input() selectedTile = null;

  possibleTerrainTypes = Tile.getTerrainTypes();

  constructor() {}

  ngOnInit(): void {
    console.log(`loaded tile info component`);
  }
}
