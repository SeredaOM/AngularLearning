import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Role } from './Models/role';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private socialAuthService: SocialAuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.socialAuthService.authState.pipe(
      map((user: SocialUser) => {
        if (user == null) return false;

        const usersRole = Role.Player;

        if (route.data.roles && route.data.roles.indexOf(usersRole) === -1) {
          return false;
        }
        return true;
      }),
      tap((isAuthorized: boolean) => {
        console.log(`AuthGuardService: isAuthorized=${isAuthorized}`);
        //console.log(route);
        if (!isAuthorized) {
          this.router.navigate(['login']);
        }
      })
    );
  }
}
