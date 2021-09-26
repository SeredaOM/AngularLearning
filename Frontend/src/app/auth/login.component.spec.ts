import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { of, Subject, throwError } from 'rxjs';
import { AuthService } from './AuthService';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoginComponent } from './login.component';
import { AuthenticateResponse } from './AuthenticateResponse';
import { PlayerModel } from '../Models/PlayerModel';

let loader: HarnessLoader;

let socialAuthClientSpy: { authState: jasmine.Spy };
let authClientSpy: {
  isLoggedIn: jasmine.Spy;
  isLoggedOut: jasmine.Spy;
  register: jasmine.Spy;
  login: jasmine.Spy;
  saveAuthInfo: jasmine.Spy;
  removeAuthInfo: jasmine.Spy;
};

function spyPropertyGetter<T, K extends keyof T>(spyObj: jasmine.SpyObj<T>, propName: K): jasmine.Spy<() => T[K]> {
  return Object.getOwnPropertyDescriptor(spyObj, propName)?.get as jasmine.Spy<() => T[K]>;
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let socialUserFake: SocialUser = new SocialUser();
  socialUserFake.email = 'email@domain.com';
  socialUserFake.idToken = 'SocialToken';
  socialUserFake.firstName = 'FN';
  socialUserFake.lastName = 'LN';
  socialUserFake.name = 'FN LN';
  const player: PlayerModel = new PlayerModel(1, 'nick', 'email', 'first', 'last', 'role');

  let socialUserSubject = new Subject();

  beforeEach(async () => {
    // https://ng-mocks.sudo.eu/api/MockInstance
    socialAuthClientSpy = jasmine.createSpyObj('SocialAuthService', [], { authState: socialUserSubject });
    authClientSpy = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'isLoggedOut',
      'register',
      'login',
      'saveAuthInfo',
      'removeAuthInfo',
    ]);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        BrowserAnimationsModule,
        MatInputModule,
        MatCardModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: SocialAuthService, useValue: socialAuthClientSpy },
        { provide: AuthService, useValue: authClientSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    authClientSpy.isLoggedIn.and.returnValue(false);
    authClientSpy.isLoggedOut.and.returnValue(false);
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  function createComponentAndDetectChanges() {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  }

  it('should create', () => {
    createComponentAndDetectChanges();

    expect(component).toBeTruthy();
  });

  it('when user is logged in to both SocialAuthService and AuthService: should not even try login', () => {
    authClientSpy.isLoggedIn.and.returnValue(true);

    createComponentAndDetectChanges();
    component.socialUser = socialUserFake;
    socialUserSubject.next(socialUserFake);

    expect(authClientSpy.login).toHaveBeenCalledTimes(0);
    expect(component.progressProcessName).toBeNull();
    expect(component.error).toBeNull();
    expect(component.errorDetails).toBeNull();
    expect(component.displayRegistrationDiv).toBeFalse();

    expect(authClientSpy.saveAuthInfo).toHaveBeenCalledTimes(0);
    expect(authClientSpy.removeAuthInfo).toHaveBeenCalledTimes(0);
  });

  it('when user is logged in to SocialAuthService but not AuthService and "login" does not respond: should display comm error', () => {
    authClientSpy.isLoggedOut.and.returnValue(true);
    authClientSpy.login.and.returnValue(throwError('Some Error'));

    createComponentAndDetectChanges();
    socialUserSubject.next(socialUserFake);

    expect(component.progressProcessName).toBeNull();
    expect(component.error).toBe(`Error reaching server`);
    expect(component.errorDetails).toBeTruthy();
    expect(component.displayRegistrationDiv).toBeFalse();

    expect(authClientSpy.removeAuthInfo).toHaveBeenCalledTimes(1);
    expect(authClientSpy.saveAuthInfo).toHaveBeenCalledTimes(0);
  });

  it('when user is logged in to SocialAuthService but not AuthService and "login" responses with Token error: should display token error', () => {
    authClientSpy.isLoggedOut.and.returnValue(true);
    authClientSpy.login.and.returnValue(
      of(new AuthenticateResponse(AuthService.NotValidTokenErrorCode, 'Error message', 'Token', 321, player))
    );

    createComponentAndDetectChanges();
    socialUserSubject.next(socialUserFake);

    expect(component.progressProcessName).toBeNull();
    expect(component.error).toBe(`Invalid authentication token`);
    expect(component.errorDetails).toContain('Token');
    expect(component.displayRegistrationDiv).toBeFalse();

    expect(authClientSpy.removeAuthInfo).toHaveBeenCalledTimes(1);
    expect(authClientSpy.saveAuthInfo).toHaveBeenCalledTimes(0);
  });

  it(
    'when user registers and "register" responses with Token error: should display token error',
    waitForAsync(async () => {
      //  implement and reuse validation logic from 'login with Token error' test
      authClientSpy.isLoggedOut.and.returnValue(true);
      authClientSpy.register.and.returnValue(
        of(new AuthenticateResponse(AuthService.NotValidTokenErrorCode, 'Error message', 'Token', 321, player))
      );

      createComponentAndDetectChanges();
      component.socialUser = socialUserFake;
      component.displayRegistrationDiv = true;
      fixture.detectChanges();

      await enterNickAndClickRegister();
      fixture.detectChanges();

      expect(component.progressProcessName).toBeNull();
      expect(component.error).toBe(`Invalid authentication token`);
      expect(component.errorDetails).toContain('Token');
      expect(component.displayRegistrationDiv).toBeFalse();

      expect(authClientSpy.removeAuthInfo).toHaveBeenCalledTimes(1);
      expect(authClientSpy.saveAuthInfo).toHaveBeenCalledTimes(0);
    })
  );

  it('when user is logged in to SocialAuthService but not AuthService and "register" does not recognize player: should prompt registration', () => {
    authClientSpy.isLoggedOut.and.returnValue(true);
    authClientSpy.login.and.returnValue(
      of(new AuthenticateResponse(AuthService.NoPlayerErrorCode, null, null, 0, null))
    );

    createComponentAndDetectChanges();
    socialUserSubject.next(socialUserFake);

    expect(component.progressProcessName).toBeNull();
    expect(component.error).toContain(`Player with email`);
    expect(component.errorDetails).toBeTruthy();
    expect(component.displayRegistrationDiv).toBeTrue();

    expect(authClientSpy.removeAuthInfo).toHaveBeenCalledTimes(1);
    expect(authClientSpy.saveAuthInfo).toHaveBeenCalledTimes(0);
  });

  it('when user is logged in to SocialAuthService but not AuthService and "login" responses OK: login should succeed', () => {
    authClientSpy.isLoggedOut.and.returnValue(true);
    const res = new AuthenticateResponse(0, '', 'Token', 123, player);
    authClientSpy.login.and.returnValue(of(res));

    createComponentAndDetectChanges();
    socialUserSubject.next(socialUserFake);

    expect(component.progressProcessName).toBeNull();
    expect(component.error).toBeNull();
    expect(component.errorDetails).toBeNull();
    expect(component.displayRegistrationDiv).toBeFalse();
    expect(component.socialUser).toBe(socialUserFake);

    expect(authClientSpy.removeAuthInfo).toHaveBeenCalledTimes(1);
    expect(authClientSpy.saveAuthInfo).toHaveBeenCalledOnceWith(res);
  });

  it(
    'when user is logged in to SocialAuthService but not AuthService and "register" responses OK: register should succeed',
    waitForAsync(async () => {
      authClientSpy.isLoggedOut.and.returnValue(true);
      const res = new AuthenticateResponse(0, '', 'Token', 123, null);
      authClientSpy.register.and.returnValue(of(res));

      createComponentAndDetectChanges();
      component.socialUser = socialUserFake;
      component.displayRegistrationDiv = true;
      fixture.detectChanges();

      await enterNickAndClickRegister();
      fixture.detectChanges();

      expect(component.progressProcessName).toBeNull();
      expect(component.error).toBeNull();
      expect(component.errorDetails).toBeNull();

      expect(authClientSpy.removeAuthInfo).toHaveBeenCalledTimes(1);
      expect(authClientSpy.saveAuthInfo).toHaveBeenCalledOnceWith(res);
    })
  );

  it(
    'Register button should become remain disabled until entered valid Nick',
    waitForAsync(async () => {
      createComponentAndDetectChanges();
      component.displayRegistrationDiv = true;
      component.socialUser = socialUserFake;

      const btn: MatButtonHarness = await getRegisterButtonHarness();
      expect(await btn.isDisabled()).toBeTrue();
      let btnNative = fixture.debugElement.nativeElement.querySelectorAll('#btn');
      expect(btnNative[0].disabled).toBeTrue();

      component.playerNick = playerNickForTest_Invalid;
      fixture.detectChanges();

      expect(component.playerNick).toBe(playerNickForTest_Invalid);
      expect(btnNative[0].disabled).toBeTrue();
      expect(await btn.isDisabled()).toBeTrue();

      const playerNickInput: MatInputHarness = await getPlayerNickInputHarness();
      expect(playerNickInput).toBeTruthy();
      await playerNickInput.setValue(playerNickForTest);
      fixture.detectChanges();

      expect(component.playerNick).toBe(playerNickForTest);
      expect(btnNative[0].disabled).toBeFalse();
      expect(await btn.isDisabled()).toBeFalse();
    })
  );

  let playerNickForTest_Invalid = 'C123';
  let playerNickForTest = 'C1234';

  async function enterNickAndClickRegister() {
    const registerButton = await getRegisterButtonHarness();
    expect(registerButton).toBeTruthy();
    expect(await registerButton.isDisabled()).toBeTrue();

    const playerNickInput: MatInputHarness = await getPlayerNickInputHarness();
    expect(playerNickInput).toBeTruthy();
    await playerNickInput.setValue(playerNickForTest);
    // setting nick via reactive form (component.playerNick) works too, but better to test via actual UI controls
    //component.playerNick = playerNickForTest;
    fixture.detectChanges();

    expect(component.playerNick).toBe(playerNickForTest);
    expect(await registerButton.isDisabled()).toBeFalse();

    await registerButton.click();
    fixture.detectChanges();
  }

  async function getRegisterButtonHarness(): Promise<MatButtonHarness> {
    return await loader.getHarness(MatButtonHarness.with({ text: 'Register' }));
  }

  async function getPlayerNickInputHarness(): Promise<MatInputHarness> {
    return await loader.getHarness(MatInputHarness.with({ selector: '#playerNick' }));
  }
});
