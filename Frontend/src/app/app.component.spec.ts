import { HttpClientModule } from '@angular/common/http';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule, RouterTestingModule],
        declarations: [AppComponent],
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
