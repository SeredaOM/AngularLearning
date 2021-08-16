import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tile } from '../tile';

@Component({
  selector: 'app-terrain-selector',
  templateUrl: './terrain-selector.component.html',
  styleUrls: ['./terrain-selector.component.css'],
})
export class TerrainSelectorComponent implements OnInit {
  @Input() viewOnly = false;
  @Input() selectedTerrain;

  @Output() selectedTerrainChange = new EventEmitter();

  possibleTerrainTypes = Tile.getTerrainTypes();

  constructor() {}

  ngOnInit(): void {
    console.log(
      `TerrainSelectorComponent: selectedTerrain=${this.selectedTerrain}`
    );
  }

  onSelectionChange(value) {
    console.log(
      `TerrainSelectorComponent: onSelectionChange new value is: ${value}`
    );
    this.selectedTerrainChange.emit(value);
  }
}
