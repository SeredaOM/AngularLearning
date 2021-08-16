import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerrainSelectorComponent } from './terrain-selector.component';

describe('TerrainSelectorComponent', () => {
  let component: TerrainSelectorComponent;
  let fixture: ComponentFixture<TerrainSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerrainSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerrainSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
