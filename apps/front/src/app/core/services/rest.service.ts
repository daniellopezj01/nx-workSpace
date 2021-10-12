import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { Toaster } from 'ngx-toast-notifications';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  public headers?: HttpHeaders;
  public readonly url: string = environment.api;

  constructor(
    public http: HttpClient,
    private router: Router,
    private toaster: Toaster,
    private translateService: TranslateService,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
  }

  parseHeader = (custom: any = null) => {
    let header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    header = custom || header;
    return new HttpHeaders(header);
  }

  setCookies(key: any, value: any) {
    this.cookieService.set(
      key,
      JSON.stringify(value),
      environment.daysTokenExpire,
      '/'
    );
  }

  logOut(): any {
    this.cookieService.delete('user', '/');
    this.cookieService.delete('session', '/');
    this.cookieService.deleteAll('/');
    this.router.navigate(['/']);
    if (isPlatformBrowser(this.platformId)) {
      window.location.reload();
    }
  }

  getCurrentUser(): any {
    try {
      return JSON.parse(this.cookieService.get('user'));
    } catch (e) {
      return null;
    }
  }

  redirectLogin = () => {
    this.router.navigate(['/', 'auth', 'register']);
  }

  setterSettings = (res: any) => {
    this.cookieService.set(
      'session',
      res.token,
      environment.daysTokenExpire,
      '/'
    );
    this.cookieService.set(
      'user',
      JSON.stringify(res.user),
      environment.daysTokenExpire,
      '/'
    );
  }

  checkSession = (verify = true, disabledGo = false, changeRedirect = undefined) => {
    return new Promise((resolve, reject) => {
      if (verify) {
        this.get('token').subscribe(
          (data) => {
            this.setterSettings(data);
            resolve(data);
          },
          (err) => {
            if (changeRedirect) {
              this.router.navigate(changeRedirect);
            } else {
              this.router.navigate(['/', 'auth']);
            }
            reject(false);
          }
        );
      } else {
        if (this.cookieService.check('session')) {
          resolve(true);
        } else {
          if (!disabledGo) {
            this.router.navigate(['/auth']);
          }
          reject(false);
        }
      }
    });
  }

  checkIsLogged = () => this.cookieService.check('session');

  showToast = (source: string) => {
    try {
      const match = `ERRORS.${source}`.toUpperCase();
      // console.log('---------->', match)
      this.translateService.get(match).subscribe((res) => {
        if (res === match) {
          const matchOne = `${source}.TOAST`;
          this.translateService.get(matchOne).subscribe((resOne) => {
            if (resOne === matchOne) {
              this.translateService.get(`ERRORS.UNDEFINED`).subscribe((r) => {
                this.toaster.open({
                  text: r.TEXT,
                  caption: r.TITLE,
                });
              });
            } else {
              this.toaster.open({
                text: resOne.TEXT,
                caption: resOne.TITLE,
              });
            }
          });
        } else {
          this.toaster.open({
            text: res.TEXT,
            caption: res.TITLE,
          });
        }
      });
    } catch (e) {
      return 422;
    }
  }

  handleError = (code = 401, message = '', e: any = {}) => {
    if (![404].includes(code)) {
      this.showToast(message);
    }
  }

  searchEmailExist(text: string) {
    // debounce
    return timer(100).pipe(
      switchMap(() => {
        // Check if username is available
        return this.get(`search/${text}`);
      })
    );
  }

  redirectAfterLogin = () => {
    const url = this.cookieService.get(`redirectUrl`)
      ? this.cookieService.get(`redirectUrl`)
      : null;
    if (url) {
      this.cookieService.delete('redirectUrl', '/');
      this.router.navigateByUrl(url);
    } else {
      this.router.navigate(['/']);
    }
  }

  checkEmail(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      return this.searchEmailExist(control.value).pipe(
        map((res) => {
          if (res) {
            return { email: true };
          }
        })
      )
    };
  }

  post(
    path = '',
    body = {},
    toast = true,
    header: any = null,
  ): Observable<any> {
    return this.http
      .post(`${this.url}/${path}`, body, { headers: this.parseHeader(header) })
      .pipe(
        catchError((e: any) => {
          if (toast) {
            this.handleError(
              e.status,
              e.error.errors && e.error.errors.msg
                ? e.error.errors && e.error.errors.msg
                : e.statusText,
              e.error
            );
          }
          return throwError(e);
        })
      );
  }

  patch(path = '', body = {}, toast = true, header = null): Observable<any> {
    return this.http
      .patch(`${this.url}/${path}`, body, { headers: this.parseHeader(header) })
      .pipe(
        catchError((e: any) => {
          this.handleError(
            e.status,
            e.error.errors && e.error.errors.msg
              ? e.error.errors && e.error.errors.msg
              : e.statusText,
            e.error
          );
          return throwError(e);
        })
      );
  }

  get(path = '', toast = true, headers = null): Observable<any> {
    return this.http
      .get(`${this.url}/${path}`, { headers: this.parseHeader(headers) })
      .pipe(
        catchError((e: any) => {
          this.handleError(
            e.status,
            e.error.errors && e.error.errors.msg
              ? e.error.errors && e.error.errors.msg
              : e.statusText,
            e.error
          );
          return throwError(e);
        })
      );
  }

  delete(path = '', toast = true): Observable<any> {
    return this.http
      .delete(`${this.url}/${path}`, { headers: this.parseHeader() })
      .pipe(
        catchError((e: any) => {
          this.handleError(
            e.status,
            e.error.errors && e.error.errors.msg
              ? e.error.errors && e.error.errors.msg
              : e.statusText,
            e.error
          );
          return throwError(e);
        })
      );
  }
}
