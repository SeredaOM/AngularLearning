import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './AuthService';
import { PlayerModel } from '../Models/PlayerModel';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const loggedIn = this.authService.isLoggedIn();
    if (!loggedIn) {
      this.router.navigate(['login']);
      console.log(`Can't access ${route.url}`);
      return false;
    }

    const player = PlayerModel.getPlayerFromStore();
    if (route.data.role) {
      if (route.data.role > player.roleLevel) {
        return false;
      }
    }
    return true;
  }
}
