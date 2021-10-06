import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { PlayerModel } from '../Models/PlayerModel';
import { AuthenticateResponse } from './AuthenticateResponse';

import { AuthService } from './AuthService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public registrationForm: FormGroup;

  isLoggedIn: Boolean = false;

  socialUser: SocialUser = null;
  player: PlayerModel = null;
  displayRegistrationDiv = false;

  get playerNick(): string {
    return this.registrationForm.value.playerNick;
  }
  set playerNick(value) {
    //this.registrationForm.value.playerNick = value; - this does not work, see commit comment for details
    this.registrationForm.controls['playerNick'].setValue(value);
  }

  progressProcessName: string = null;
  error: string = null;
  errorDetails: string = null;

  subscription: Subscription;

  constructor(private router: Router, private socialAuthService: SocialAuthService, public authService: AuthService) {
    this.registrationForm = new FormGroup({
      playerNick: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15),
        Validators.pattern('^[a-zA-Z0-9]+$'),
      ]),
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    console.log(`LoginComponent, authServiceIsLoggedIn: ${this.authService.isLoggedIn()}`);

    if (this.authService.isLoggedIn()) {
      this.player = PlayerModel.getPlayerFromStore();
    }

    this.subscribeToSocialAuthService();
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  loginWithGoogle(): void {
    this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => {
        console.log(`LoginComponent: received feedback from Google`);
      })
      .catch((err) => {
        console.log(`Error signing-in: `);
        console.log(err);
        this.error = `Can't login using Google`;
        this.errorDetails = err;
      });
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    //  https://www.javacodegeeks.com/2019/06/angular-facebook-login-example.html
    //  https://morioh.com/p/a83878b5f50a
  }

  signInWithMictosoft(): void {
    //  https://github.com/abacritt/angularx-social-login/blob/HEAD/microsoft-provider.md
  }

  signOut(): void {
    this.progressProcessName = 'Logging out...';
    this.socialAuthService.signOut(true);
    this.authService.logout().subscribe(
      () => {
        console.log(`Completed logout`);

        this.progressProcessName = null;
        this.player = null;
        this.isLoggedIn = false;
      },
      (error: any) => {
        console.log(`handling logout error`);
        console.log(error);

        this.progressProcessName = null;

        this.error = 'Error during logout';
        this.errorDetails = error.message;
      }
    );
  }

  public subscribeToSocialAuthService() {
    console.log(`LoginComponent.subscribeToSocialAuthService`);

    this.subscription = this.socialAuthService.authState.subscribe((user) => {
      console.log(`LoginComponent.subscribe - social user state changed:`);
      console.log(user);

      if (user == null) {
      } else {
        this.socialUser = user;
        if (this.authService.isLoggedOut()) {
          console.log(`Try to login`);
          this.progressProcessName = 'Login';
          this.authService.login(user.idToken).subscribe(
            (res: AuthenticateResponse) => {
              console.log(`handling login success`);
              console.log(res);
              this.handleResponse(res);
            },
            (error: any) => {
              console.log(`handling login error`);
              console.log(error);
              this.handleResponse(new AuthenticateResponse(AuthService.CommunicationErrorCode, error.message));
            }
          );
        } else {
          console.warn(`Social user state changed while player is already logged in`);
        }
      }
    });
  }

  register() {
    console.log(`Registration started, nick: ${this.playerNick}`);
    this.progressProcessName = 'Registration';
    this.authService
      .register(
        this.socialUser.idToken,
        this.playerNick,
        this.socialUser.email,
        this.socialUser.firstName,
        this.socialUser.lastName
      )
      .subscribe(
        (res: AuthenticateResponse) => {
          console.log(`handling registration success`);
          console.log(res);
          this.handleResponse(res);
        },
        (error: any) => {
          console.log(`handling registration error`);
          console.log(error);
          this.handleResponse(
            new AuthenticateResponse(AuthService.CommunicationErrorCode, error.message, null, 0, null)
          );
        }
      );
  }

  private handleResponse(res: AuthenticateResponse) {
    this.progressProcessName = null;

    const errorCode = res.resultCode;
    console.log(`handle response code = ${errorCode}`);
    this.authService.removeAuthInfo();
    switch (errorCode) {
      case AuthService.CommunicationErrorCode:
        this.error = `Error reaching server`;
        this.errorDetails = 'Please try again in 1-2 minutes or contact the support';
        break;

      case 0:
        this.authService.saveAuthInfo(res);
        this.player = PlayerModel.getPlayerFromStore();
        this.isLoggedIn = true;
        this.router.navigate(['/']);
        break;

      case AuthService.NotValidTokenErrorCode: // any time
        this.error = `Invalid authentication token`;
        this.errorDetails = `Token provided by 3rd-party is not valid. Try to use another login provider or contact the support`;
        this.displayRegistrationDiv = false;
        break;

      case AuthService.NoPlayerErrorCode: // after login
        this.error = `Player with email "${this.socialUser.email}" is not registered`;
        this.errorDetails = `Please create account for your email address if you wish to proceed`;
        this.displayRegistrationDiv = true;
        break;

      case AuthService.NickOrEmailAreTakenErrorCode: //  after registration
        this.error = `Player requested nick name (or email?) already registered`;
        this.errorDetails = `Please chose another nick name or login with specified email`;
        break;

      case AuthService.InvalidRegistrationDataErrorCode: //  after registration
        this.error = `Invalid registration data`;
        this.errorDetails = res.resultMessage;
        break;

      default:
        this.error = 'Unknown error';
        this.errorDetails = `Error code: ${errorCode}`;
        break;
    }
  }
}
