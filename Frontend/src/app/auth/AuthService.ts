import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as moment from 'moment';
import { SocialAuthService } from 'angularx-social-login';

import { ApiService } from '../api.service';

// https://tecknoworks.com/how-to-integrate-social-login-in-a-web-api-solution/
// https://levelup.gitconnected.com/how-to-sign-in-with-google-in-angular-and-use-jwt-based-net-core-api-authentication-rsa-6635719fb86c
// https://blog.angular-university.io/angular-jwt-authentication/

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public loggedIn: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  constructor(private httpClient: HttpClient, private socialAuthService: SocialAuthService) {
    this.socialAuthService.authState.subscribe((user) => {
      if (user == null) {
        if (this.isLoggedIn()) {
          this.logout();
        }
      } else {
        if (this.isLoggedOut()) {
          this.login(user.idToken);
        }
      }
    });
  }

  private static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  public login(token: string) {
    return this.httpClient
      .post(ApiService.getHost() + '/auth/login', { idToken: token }, AuthService.httpOptions)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(`Error trying to auth: ${error.error.detail}`);
          console.log(error);
          this.loggedIn.next(false);

          this.removeAuthInfo();

          return throwError(`Could not Auth. Try again or contact support.`);
        })
      )
      .subscribe((res: string) => {
        const expiresAt = moment().add(res[AuthService.ExpiresInMinutes], 'minutes');

        localStorage.setItem(AuthService.AuthToken, res[AuthService.AuthToken]);
        localStorage.setItem(AuthService.ExpiresAt, JSON.stringify(expiresAt.valueOf()));
        localStorage.setItem(AuthService.Role, res[AuthService.Role]);

        this.loggedIn.next(true);
        console.log(`Completed login`);
      });
  }

  logout() {
    // remove user from local storage to log user out
    this.removeAuthInfo();
    this.loggedIn.next(false);

    const token = localStorage.getItem(AuthService.AuthToken);
    this.httpClient
      .post(ApiService.getHost() + '/auth/logout', { idToken: token }, AuthService.httpOptions)
      .subscribe(() => {
        console.log(`Completed logout`);
      });
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  public getExpiration() {
    const expiration = localStorage.getItem(AuthService.ExpiresAt);
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  private removeAuthInfo() {
    localStorage.removeItem(AuthService.AuthToken);
    localStorage.removeItem(AuthService.ExpiresAt);
    localStorage.removeItem(AuthService.Role);
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
  public static get Role() {
    return 'role';
  }
}
