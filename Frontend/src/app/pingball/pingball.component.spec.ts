import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PingballComponent } from './pingball.component';

describe('PingballComponent', () => {
  let component: PingballComponent;
  let fixture: ComponentFixture<PingballComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PingballComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PingballComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
