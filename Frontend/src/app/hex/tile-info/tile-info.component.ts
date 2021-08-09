import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Tile } from '../tile';

@Component({
  selector: 'app-tile-info',
  templateUrl: './tile-info.component.html',
  styleUrls: ['./tile-info.component.css'],
})
export class TileInfoComponent implements OnInit, OnChanges {
  @Input() viewOnly = false;
  @Input() selectedTile = null;

  constructor() {}

  ngOnInit(): void {
    console.log(`loaded tile info component`);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(`viewOnly=${this.viewOnly}`);
    if (changes.selectedTile) {
      console.log(
        `changed 'selectedTile' on tile info component, new coords: ${this.selectedTile.x},${this.selectedTile.y}`
      );
    }
  }
}
