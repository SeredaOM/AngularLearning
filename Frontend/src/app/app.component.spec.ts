import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MatButtonHarness } from '@angular/material/button/testing';
import { MatToolbar } from '@angular/material/toolbar';

import { Subject } from 'rxjs';

import { AppComponent } from './app.component';
import { AuthService } from './auth/AuthService';

describe('AppComponent', () => {
  let loader: HarnessLoader;

  let authClientSpy: {
    isLoggedIn: jasmine.Spy;
    loggedIn: jasmine.Spy;
  };
  let authClientLoggedInSubject = new Subject();

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    authClientSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn'], { loggedIn: authClientLoggedInSubject });

    await TestBed.configureTestingModule({
      declarations: [AppComponent, MatToolbar],
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authClientSpy }],
    }).compileComponents();
  });

  function createComponent() {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  }
  function createComponentWithDefaultMocks() {
    authClientSpy.isLoggedIn.and.returnValue(false);
    createComponent();
  }

  it(
    'should render title and "Home" button for any player',
    waitForAsync(async () => {
      createComponentWithDefaultMocks();

      const app = fixture.componentInstance;
      expect(app).toBeTruthy();
      expect(app.title).toEqual('angular-example');
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('h1').textContent).toContain('Browser Strategy Game "Elita"');

      const btnHome = await loader.getHarness(MatButtonHarness.with({ text: 'Home' }));
      expect(btnHome).toBeTruthy();
    })
  );

  it(
    'should NOT display "map" button if player is not logged in',
    waitForAsync(async () => {
      createComponentWithDefaultMocks();

      const mapsButtons = await loader.getAllHarnesses(MatButtonHarness.with({ text: 'Maps' }));
      expect(mapsButtons.length).toBe(0);
    })
  );

  it(
    'should display "map" button after player logs in',
    waitForAsync(async () => {
      createComponentWithDefaultMocks();

      authClientSpy.isLoggedIn.and.returnValue(true);
      authClientLoggedInSubject.next(true);
      fixture.detectChanges();

      const mapsButtons = await loader.getAllHarnesses(MatButtonHarness.with({ text: 'Maps' }));
      expect(mapsButtons.length).toBe(1);
      expect(mapsButtons[0]).toBeTruthy();
    })
  );

  it(
    'should display "map" button if player is logged in when he opens the page',
    waitForAsync(async () => {
      authClientSpy.isLoggedIn.and.returnValue(true);
      createComponent();

      const mapsButtons = await loader.getAllHarnesses(MatButtonHarness.with({ text: 'Maps' }));
      expect(mapsButtons.length).toBe(1);
      expect(mapsButtons[0]).toBeTruthy();
    })
  );
});
