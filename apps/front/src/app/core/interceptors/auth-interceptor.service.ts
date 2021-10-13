import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private router: Router, private cookieService: CookieService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = this.cookieService.get('session');
    const userReferred: string = this.cookieService.get('userReferred');
    let urlPath: any = req?.url;
    urlPath = urlPath.split('/');
    // && _.indexOf(urlPath, 'register') > -1
    if (userReferred) {
      if (req.method.toLowerCase() === 'post') {
        if (req.body instanceof FormData) {
          req = req.clone({
            body: req.body.append('userReferred', userReferred),
          });
        } else {
          const foo: any = {};
          foo.userReferred = userReferred;
          req = req.clone({
            body: { ...req.body, ...foo },
          });
        }
      }
    }

    let request = req;
    if (token) {
      request = req.clone({
        setHeaders: {
          authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // this.router.navigateByUrl('/login');
        }
        return throwError(err);
      })
    );
  }
}
