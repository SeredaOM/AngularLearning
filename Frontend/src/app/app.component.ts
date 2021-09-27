import { Component } from '@angular/core';

import { AuthService } from './auth/AuthService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-example';

  loggedIn: Boolean = false;

  constructor(private authService: AuthService) {
    this.authService.loggedIn.subscribe((val) => {
      this.loggedIn = this.authService.isLoggedIn();
    });
  }

  ngOnInit() {
    this.loggedIn = this.authService.isLoggedIn();
  }
}
