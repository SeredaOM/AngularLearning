import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { of, throwError } from 'rxjs';
import { AuthService } from './AuthService';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoginComponent } from './login.component';
import { AuthenticateResponse } from './AuthenticateResponse';

let socialAuthClientSpy: { authState: jasmine.Spy };
let authClientSpy: {
  isLoggedIn: jasmine.Spy;
  isLoggedOut: jasmine.Spy;
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

  let user: SocialUser = new SocialUser();
  user.email = 'email@domain.com';
  user.idToken = 'SocialToken';
  user.firstName = 'FN';
  user.lastName = 'LN';
  user.name = 'FN LN';

  beforeEach(async () => {
    // https://ng-mocks.sudo.eu/api/MockInstance
    socialAuthClientSpy = jasmine.createSpyObj('SocialAuthService', [], { authState: of(user) });
    authClientSpy = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'isLoggedOut',
      'login',
      'saveAuthInfo',
      'removeAuthInfo',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatInputModule,
        MatCardModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        RouterTestingModule,
      ],
      declarations: [LoginComponent],
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

  it('should create', () => {
    CreateComponentAndDetectChanges();

    expect(component).toBeTruthy();
  });

  it('when user is logged in to both SocialAuthService and AuthService: should not even try login', () => {
    authClientSpy.isLoggedIn.and.returnValue(true);

    CreateComponentAndDetectChanges();

    expect(authClientSpy.login).toHaveBeenCalledTimes(0);
    expect(component.progressProcessName).toBeNull();
    expect(component.error).toBeNull();
    expect(component.errorDetails).toBeNull();
    expect(component.displayRegistrationDiv).toBeFalse();

    expect(authClientSpy.saveAuthInfo).toHaveBeenCalledTimes(0);
    expect(authClientSpy.removeAuthInfo).toHaveBeenCalledTimes(0);
  });

  it('when user is logged in to SocialAuthService but not AuthService and server does not respond: should display comm error', () => {
    authClientSpy.isLoggedOut.and.returnValue(true);
    authClientSpy.login.and.returnValue(throwError('Some Error'));

    CreateComponentAndDetectChanges();

    expect(component.progressProcessName).toBeNull();
    expect(component.error).toBe(`Error reaching server`);
    expect(component.errorDetails).toBeTruthy();
    expect(component.displayRegistrationDiv).toBeFalse();

    expect(authClientSpy.removeAuthInfo).toHaveBeenCalledTimes(1);
    expect(authClientSpy.saveAuthInfo).toHaveBeenCalledTimes(0);
  });

  it('when user is logged in to SocialAuthService but not AuthService and server responses with Token error: should display token error', () => {
    authClientSpy.isLoggedOut.and.returnValue(true);
    authClientSpy.login.and.returnValue(
      of(new AuthenticateResponse(AuthService.NotValidTokenErrorCode, 'Error message', 'Token', 321, 'role'))
    );

    CreateComponentAndDetectChanges();

    expect(component.progressProcessName).toBeNull();
    expect(component.error).toBe(`Invalid authentication token`);
    expect(component.errorDetails).toContain('Token');
    expect(component.displayRegistrationDiv).toBeFalse();

    expect(authClientSpy.removeAuthInfo).toHaveBeenCalledTimes(1);
    expect(authClientSpy.saveAuthInfo).toHaveBeenCalledTimes(0);
  });

  // it('when user registers and server responses with Token error: should display token error', () => {
  // implement and reuse validation logic from 'login with Token error' test
  // });

  it('when user is logged in to SocialAuthService but not AuthService and server does not recognize player: should prompt registration', () => {
    authClientSpy.isLoggedOut.and.returnValue(true);
    authClientSpy.login.and.returnValue(
      of(new AuthenticateResponse(AuthService.NoPlayerErrorCode, null, null, 0, null))
    );

    CreateComponentAndDetectChanges();

    expect(component.progressProcessName).toBeNull();
    expect(component.error).toContain(`Player with email`);
    expect(component.errorDetails).toBeTruthy();
    expect(component.displayRegistrationDiv).toBeTrue();

    expect(authClientSpy.removeAuthInfo).toHaveBeenCalledTimes(1);
    expect(authClientSpy.saveAuthInfo).toHaveBeenCalledTimes(0);
  });

  it('when user is logged in to SocialAuthService but not AuthService and server responses OK: login should succeed', () => {
    authClientSpy.isLoggedOut.and.returnValue(true);
    const res = new AuthenticateResponse(0, '', 'Token', 123, 'role');
    authClientSpy.login.and.returnValue(of(res));

    CreateComponentAndDetectChanges();

    expect(component.progressProcessName).toBeNull();
    expect(component.error).toBeNull();
    expect(component.errorDetails).toBeNull();
    expect(component.displayRegistrationDiv).toBeFalse();

    expect(authClientSpy.removeAuthInfo).toHaveBeenCalledTimes(1);
    expect(authClientSpy.saveAuthInfo).toHaveBeenCalledOnceWith(res);
  });

  function CreateComponentAndDetectChanges() {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }
});
