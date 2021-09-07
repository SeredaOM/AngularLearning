import { Component } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
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

  constructor(private authService: SocialAuthService) {
    this.authService.authState.subscribe((user) => {
      console.log(user);
      this.user = user;
      this.loggedIn = user != null;
    });
  }

  ngOnInit() {}
}
