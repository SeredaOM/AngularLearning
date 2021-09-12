import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as moment from 'moment';
import { SocialAuthService, SocialUser } from 'angularx-social-login';

import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: SocialUser = null;
  public loggedIn: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  constructor(private httpClient: HttpClient, private socialAuthService: SocialAuthService) {
    this.socialAuthService.authState.subscribe((user) => {
      console.log(`AuthService.socialAuthService.authState:`);
      console.log(user);

      this.user = user;

      if (user == null) {
        this.loggedIn.next(false);
        this.logout();
      } else {
        this.login(user.idToken);
      }
    });
  }

  private static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // Example of implementing backend:
  // https://tecknoworks.com/how-to-integrate-social-login-in-a-web-api-solution/
  // https://levelup.gitconnected.com/how-to-sign-in-with-google-in-angular-and-use-jwt-based-net-core-api-authentication-rsa-6635719fb86c
  public login(token: string) {
    return this.httpClient
      .post(ApiService.getHost() + '/auth/login', { idToken: token }, AuthService.httpOptions)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(`Error trying to auth: ${error.error.detail}`);
          console.log(error);
          this.loggedIn.next(false);

          localStorage.removeItem(AuthService.AuthToken);
          localStorage.removeItem(AuthService.ExpiresAt);

          return throwError(`Could not Auth. Try again or contact support.`);
        })
      )
      .subscribe((res: string) => {
        console.log(`Completed auth`);
        console.log(res[AuthService.AuthToken]);
        console.log(res[AuthService.ExpiresInMinutes]);

        const expiresAt = moment().add(res['ExpiresInMinutes'], 'minute');
        localStorage.setItem(AuthService.AuthToken, res[AuthService.AuthToken]);
        localStorage.setItem(AuthService.ExpiresAt, JSON.stringify(expiresAt.valueOf()));
        // https://blog.angular-university.io/angular-jwt-authentication/

        this.loggedIn.next(true);
      });
  }

  logout() {
    // remove user from local storage to log user out
    this.loggedIn.next(false);

    const token = localStorage.getItem(AuthService.AuthToken);
    this.httpClient
      .post(ApiService.getHost() + '/auth/logout', { idToken: token }, AuthService.httpOptions)
      .subscribe(() => {
        localStorage.removeItem(AuthService.AuthToken);
        localStorage.removeItem(AuthService.ExpiresAt);
      });
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  private getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  public static get AuthToken() {
    return 'authToken';
  }
  private static get ExpiresInMinutes() {
    return 'expiresInMinutes';
  }
  private static get ExpiresAt() {
    return 'expiresAt';
  }
}
