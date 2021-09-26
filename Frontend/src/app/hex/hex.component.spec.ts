import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { TileInfoComponent } from './tile-info/tile-info.component';
import { ValueSelectorComponent } from './value-selector/value-selector.component';
import { HexComponent } from './hex.component';
import { FormsModule } from '@angular/forms';

describe('HexComponent', () => {
  let component: HexComponent;
  let fixture: ComponentFixture<HexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HexComponent, TileInfoComponent, ValueSelectorComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        RouterTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HexComponent);
    component = fixture.componentInstance;
    component.defaultTerrain = 'Invalid';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
