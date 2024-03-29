import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import * as moment from 'moment';
import { plainToClass } from 'class-transformer';

import { ApiService } from '../api.service';
import { AuthenticateResponse } from './AuthenticateResponse';
import { PlayerModel } from '../Models/PlayerModel';

// https://tecknoworks.com/how-to-integrate-social-login-in-a-web-api-solution/
// https://levelup.gitconnected.com/how-to-sign-in-with-google-in-angular-and-use-jwt-based-net-core-api-authentication-rsa-6635719fb86c
// https://blog.angular-university.io/angular-jwt-authentication/

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public loggedIn: ReplaySubject<Boolean> = new ReplaySubject<Boolean>();

  constructor(private httpClient: HttpClient) {}

  private static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  public register(token: string, nick: string, email: string, firstName: string, lastName: string) {
    return this.httpClient.post(
      ApiService.getHost() + '/auth/register',
      { idToken: token, nick: nick, email: email, firstName: firstName, lastName: lastName },
      AuthService.httpOptions
    );
  }

  public login(token: string) {
    return this.httpClient.post(ApiService.getHost() + '/auth/login', { idToken: token }, AuthService.httpOptions);
  }

  logout() {
    const token = localStorage.getItem(AuthService.AuthToken);
    let res = this.httpClient.post(ApiService.getHost() + '/auth/logout', { idToken: token }, AuthService.httpOptions);
    this.removeAuthInfo();
    return res;
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

  public saveAuthInfo(response: AuthenticateResponse) {
    const expiresAt = moment().add(response.expiresInMinutes, 'minutes');
    localStorage.setItem(AuthService.AuthToken, response.authToken);
    localStorage.setItem(AuthService.ExpiresAt, JSON.stringify(expiresAt.valueOf()));

    const player = plainToClass(PlayerModel, response.player);
    player.storeItems();

    this.loggedIn.next(true);
  }
  public removeAuthInfo() {
    localStorage.removeItem(AuthService.AuthToken);
    localStorage.removeItem(AuthService.ExpiresAt);
    PlayerModel.removeItems();

    this.loggedIn.next(false);
  }

  public static get CommunicationErrorCode() {
    return -1;
  }
  public static get NotValidTokenErrorCode() {
    return 1;
  }
  public static get NoPlayerErrorCode() {
    return 2;
  }
  public static get NickOrEmailAreTakenErrorCode() {
    return 3;
  }
  public static get InvalidRegistrationDataErrorCode() {
    return 4;
  }

  public static get ResultCode() {
    return 'resultCode';
  }
  public static get ResultMessage() {
    return 'resultMessage';
  }
  public static get AuthToken() {
    return 'authToken';
  }
  private static get ExpiresAt() {
    return 'expiresAt';
  }
}
