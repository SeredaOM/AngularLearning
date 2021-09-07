import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';

export class AuthService {
  constructor(private httpClient: HttpClient) {}

  // Example of implementing backend:
  // https://tecknoworks.com/how-to-integrate-social-login-in-a-web-api-solution/
  login(username: string, password: string, token?, email?) {
    //return this.httpClient.post(ApiService.getHost() + '/auth/login/' + username);
    return this.httpClient.post<any>(`http://host/users/authenticate`, { username, password }).pipe(
      map((user) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}
