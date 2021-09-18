import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { SocialAuthService, SocialUser } from 'angularx-social-login';

import { Role } from './role';
import { AuthService } from './AuthService';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private socialAuthService: SocialAuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.socialAuthService.authState.pipe(
      map((user: SocialUser) => {
        if (user == null) return false;

        const usersRole = localStorage.getItem(AuthService.Role);

        if (route.data.role) {
          if (route.data.role > Role[usersRole]) {
            return false;
          }
        }
        return true;
      }),
      tap((isAuthorized: boolean) => {
        if (!isAuthorized) {
          this.router.navigate(['login']);
        }
      })
    );
  }
}
