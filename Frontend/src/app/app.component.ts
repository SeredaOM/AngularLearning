import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './login/AuthService';
import { Demo } from './ObservablesDemo/Demo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-example';

  user: SocialUser = null;
  loggedIn: Boolean = false;

  constructor(private socialAuthService: SocialAuthService, private authService: AuthService) {
    this.socialAuthService.authState.subscribe((user) => {
      console.log(user);

      this.user = user;
      this.loggedIn = user != null;

      if (user != null) {
        console.log(user.idToken);
        authService
          .login(user.idToken)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              console.log(`Error trying to auth: ${error.error.detail}`);
              console.log(error);
              return throwError(`Could not Auth. Try again or contact support.`);
            })
          )
          .subscribe((email: string) => {
            console.log(`Completed auth`);
            console.log(email);
          });
      }
    });
  }

  ngOnInit() {}
}
