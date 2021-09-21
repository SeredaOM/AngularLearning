import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { ValueSelectorComponent } from './value-selector.component';

describe('ValueSelectorComponent', () => {
  let component: ValueSelectorComponent;
  let fixture: ComponentFixture<ValueSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValueSelectorComponent],
      imports: [BrowserAnimationsModule, MatFormFieldModule, MatSelectModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueSelectorComponent);
    component = fixture.componentInstance;

    component.valuesType = 'terrain';

    fixture.detectChanges();
  });

  it('should create for terrain', () => {
    expect(component).toBeTruthy();
  });
});
