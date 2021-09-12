import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  private static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // Example of implementing backend:
  // https://tecknoworks.com/how-to-integrate-social-login-in-a-web-api-solution/
  // https://levelup.gitconnected.com/how-to-sign-in-with-google-in-angular-and-use-jwt-based-net-core-api-authentication-rsa-6635719fb86c
  public login(token: string) {
    return this.httpClient.post(ApiService.getHost() + '/auth/login', { idToken: token }, AuthService.httpOptions);
  }

  //   logout() {
  //     // remove user from local storage to log user out
  //     localStorage.removeItem('user');
  //     this.userSubject.next(null);
  //   }
}
