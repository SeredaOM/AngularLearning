import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tile } from '../tile';

import { TileInfoComponent } from './tile-info.component';

describe('TileInfoComponent', () => {
  let component: TileInfoComponent;
  let fixture: ComponentFixture<TileInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TileInfoComponent],
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
