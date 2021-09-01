import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Tile } from '../tile';

@Component({
  selector: 'app-tile-info',
  templateUrl: './tile-info.component.html',
  styleUrls: ['./tile-info.component.css'],
})
export class TileInfoComponent implements OnInit, OnChanges {
  @Input() viewOnly = false;
  @Input() selectedTile = null;

  public coords: string = '';
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes.selectedTile.currentValue);
    const tile = changes.selectedTile.currentValue;
    this.coords = `${tile.getX()}, ${tile.y}`;
  }
}
