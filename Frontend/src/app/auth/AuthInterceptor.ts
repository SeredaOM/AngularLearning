import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './AuthService';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem(AuthService.AuthToken);

    if (authToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + authToken),
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
