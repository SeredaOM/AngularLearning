import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { AppComponent } from './app.component';

class MockSocialAuthService extends SocialAuthService {}

describe('AppComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [AppComponent],
        providers: [
          SocialAuthService,
          {
            provide: 'SocialAuthServiceConfig',
            useValue: {
              autoLogin: true, //keeps the user signed in
              providers: [
                {
                  id: GoogleLoginProvider.PROVIDER_ID,
                  provider: new GoogleLoginProvider('Cliend ID'),
                },
              ],
            },
          },
        ],
      }).compileComponents();

      TestBed.overrideComponent(AppComponent, {
        set: {
          providers: [{ provide: SocialAuthService, useClass: MockSocialAuthService }],
        },
      });
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'angular-example'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('angular-example');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Browser Strategy Game "Elita"');
  });
});
