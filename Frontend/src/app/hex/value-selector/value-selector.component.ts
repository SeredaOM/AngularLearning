import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tile } from '../tile';

@Component({
  selector: 'app-value-selector',
  templateUrl: './value-selector.component.html',
  styleUrls: ['./value-selector.component.css'],
})
export class ValueSelectorComponent implements OnInit {
  @Input() label: string;
  @Input() hint: string;
  @Input() valuesType: string;
  @Input() viewOnly = false;
  @Input() selectedValue;

  @Output() selectedValueChange = new EventEmitter();

  public possibleValues: string[];

  constructor() {}

  ngOnInit(): void {
    switch (this.valuesType) {
      case 'terrain':
        this.possibleValues = Tile._terrains;
        break;

      case 'resources':
        this.possibleValues = Tile._resources;
        break;

      default:
        console.error(`Unsupported valuesType (${this.valuesType}) in 'values-selector' component`);
    }
  }

  onSelectionChange(value) {
    this.selectedValueChange.emit(value);
  }
}
