import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ValueSelectorComponent } from '../value-selector/value-selector.component';
import { Tile } from '../tile';
import { TileInfoComponent } from './tile-info.component';

describe('TileInfoComponent', () => {
  let component: TileInfoComponent;
  let fixture: ComponentFixture<TileInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
      declarations: [TileInfoComponent, ValueSelectorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TileInfoComponent);
    component = fixture.componentInstance;
    component.selectedTile = Tile.getEmptyTile();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
