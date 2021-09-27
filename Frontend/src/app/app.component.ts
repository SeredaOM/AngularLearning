import { Component } from '@angular/core';

import { AuthService } from './auth/AuthService';
import { Role } from './Models/Auth/role';
import { PlayerModel } from './Models/PlayerModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-example';

  loggedIn: Boolean = false;
  isAdmin: Boolean = false;

  constructor(private authService: AuthService) {
    this.authService.loggedIn.subscribe((val) => {
      this.pullLoginData();
    });
  }

  ngOnInit() {
    this.pullLoginData();
  }

  private pullLoginData() {
    this.loggedIn = this.authService.isLoggedIn();
    if (this.loggedIn) {
      const player: PlayerModel = PlayerModel.getPlayerFromStore();
      this.isAdmin = Role[player.role] == Role.admin;
    } else {
      this.isAdmin = false;
    }
  }
}
