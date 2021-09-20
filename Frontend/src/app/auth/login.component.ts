import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
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

  playerIdToken: string = null;
  playerNick: string = null;
  playerEmail: string = null;
  playerFirstName: string = null;
  playerLastName: string = null;
  displayRegistrationDiv = false;

  progressProcessName: string = null;
  error: string = null;
  errorDetails: string = null;

  constructor(private router: Router, private socialAuthService: SocialAuthService, public authService: AuthService) {}

  ngOnInit() {
    this.registrationForm = new FormGroup({
      playerNick: new FormControl(this.playerNick, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15),
        Validators.pattern('^[a-zA-Z0-9]+$'),
      ]),
    });

    this.isLoggedIn = this.authService.isLoggedIn();
    console.log(`LoginComponent, authServiceIsLoggedIn: ${this.authService.isLoggedIn()}`);

    this.subscribeToSocialAuthService();
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
    this.socialAuthService.signOut(true);
  }

  public subscribeToSocialAuthService() {
    console.log(`LoginComponent.subscribeToSocialAuthService`);

    this.socialAuthService.authState.subscribe((user) => {
      console.log(
        `LoginComponent.subscribe - user state changed: user=${
          user == null ? 'null' : user.email + ', token="' + user.idToken + '"'
        }`
      );

      if (user == null) {
        if (this.authService.isLoggedIn()) {
          this.authService.logout();
        }
      } else {
        if (this.authService.isLoggedOut()) {
          console.log(`Try to login`);
          this.progressProcessName = 'Login';
          this.playerIdToken = user.idToken;
          this.playerEmail = user.email;
          this.playerFirstName = user.firstName;
          this.playerLastName = user.lastName;

          this.authService.login(user.idToken).subscribe(
            (res: AuthenticateResponse) => {
              console.log(`handling success`);
              console.log(res);
              this.handleLoginResponse(res);
            },
            (error: any) => {
              console.log(`handling error`);
              console.log(error);
              this.handleLoginResponse(
                new AuthenticateResponse(AuthService.CommunicationErrorCode, error.message, null, 0, null)
              );
            }
          );
        }
      }
    });
  }

  private handleLoginResponse(res: AuthenticateResponse) {
    let _this = this;
    this.progressProcessName = null;

    const errorCode = res.resultCode;
    console.log(`handleLoginResponse: code=${errorCode}`);
    this.authService.removeAuthInfo();
    switch (errorCode) {
      case AuthService.CommunicationErrorCode:
        this.error = `Error reaching server`;
        this.errorDetails = 'Please try again in 1-2 minutes or contact the support';
        break;

      case 0:
        this.authService.saveAuthInfo(res);
        this.router.navigate(['/']);
        break;

      case AuthService.NotValidTokenErrorCode: // any time
        this.error = `Invalid authentication token`;
        this.errorDetails = `Token provided by 3rd-party is not valid. Try to use another login provider or contact the support`;
        _this.displayRegistrationDiv = false;
        break;

      case AuthService.NoPlayerErrorCode: // after login
        this.error = `Player with email "${this.playerEmail}" is not registered`;
        this.errorDetails = `Please create account for your email address if you wish to proceed`;
        _this.displayRegistrationDiv = true;
        break;

      case AuthService.NickOrEmailAreTakenErrorCode: //  after registration
        this.error = `Player requested nick name (or email?) already registered`;
        this.errorDetails = `Please chose another nick name or login with specified email`;
        _this.displayRegistrationDiv = true;
        break;

      default:
        this.error = 'Unknown error';
        this.errorDetails = `Error code: ${errorCode}`;
        break;
    }
  }

  register() {
    console.log(`Registration started`);
    this.progressProcessName = 'Registration';
    this.authService.register(
      this.playerIdToken,
      this.playerNick,
      this.playerEmail,
      this.playerFirstName,
      this.playerLastName
    );
  }
}
