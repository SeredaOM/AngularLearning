import { HttpClientModule } from '@angular/common/http';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MatToolbar } from '@angular/material/toolbar';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent, MatToolbar],
        imports: [HttpClientModule, RouterTestingModule],
        providers: [],
      }).compileComponents();
    })
  );

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    expect(app.title).toEqual('angular-example');
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Browser Strategy Game "Elita"');
  });
});
