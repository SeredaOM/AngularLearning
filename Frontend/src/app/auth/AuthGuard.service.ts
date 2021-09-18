import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Role } from './role';
import { AuthService } from './AuthService';

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

    const usersRole = localStorage.getItem(AuthService.Role);

    if (route.data.role) {
      if (route.data.role > Role[usersRole]) {
        return false;
      }
    }
    return true;
  }
}
