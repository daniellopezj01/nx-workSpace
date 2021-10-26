import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { Toaster } from 'ngx-toast-notifications';
import { SharedService } from '../../modules/shared/shared.service';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  @Output() catchError = new EventEmitter<any>();
  private confirmLeave = false;
  public headers?: HttpHeaders;
  public readonly url: string = environment.api;

  constructor(
    public http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private toaster: Toaster,
    private translateService: TranslateService,
    private share: SharedService
  ) { }

  public get getActiveConfirmLeave(): boolean {
    return this.confirmLeave;
  }

  public set setActiveConfirmLeave(v: boolean) {
    this.confirmLeave = v;
  }

  clearSession = () => {
    this.cookieService.delete('session', ' / ');
    this.cookieService.delete('user', ' / ');
    this.router.navigate(['/', 'list']);
  };

  parseHeader = (custom: any = null) => {
    let header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    header = custom || header;
    return new HttpHeaders(header);
  };

  public leaveDialog = () =>
    new Observable((observer) => {
      this.translateService.get('GENERAL').subscribe((res: any) => {
        const { ARE_YOU_SURE, ARE_YOU_SURE_SENTENCE, OK, ANY_ISSUE } = res;
        const objectDialog: any = {
          title: ARE_YOU_SURE,
          text: ARE_YOU_SURE_SENTENCE,
          icon: null,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: OK,
          footer: '<a href>' + ANY_ISSUE + '</a>',
        }
        Swal.fire(objectDialog).then((res: any) => {
          observer.next(res.isConfirmed);
          observer.complete();
        });
      });
    });

  showToast = (source: string) => {
    try {
      const match = `ERRORS.${source}`;
      this.translateService.get(match).subscribe((res: any) => {
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
      console.log(e)
    }
  };

  getCurrentUser(): any {
    try {
      return JSON.parse(this.cookieService.get('user'));
    } catch (e) {
      return null;
    }
  }


  toastSuccess(title: any, description: any) {
    this.toaster.open({
      text: title,
      caption: description,
    });
  }

  handleError = (code = 401, message = '', e: any = {}) => {
    this.showToast(message);
  };

  post(
    path = '',
    body = {},
    toast = true,
    header: any = null
  ): Observable<any> {
    return this.http
      .post(`${this.url}/${path}`, body, { headers: this.parseHeader(header) })
      .pipe(
        catchError((e: any) => {
          this.handleError(
            e.status,
            e.error.errors.msg ? e.error.errors.msg : e.statusText,
            e.error
          );
          return throwError(e);
        }),
        tap(() => (this.share.setLoadingButton = false)),
        tap(() => (this.setActiveConfirmLeave = false))
      );
  }

  patch(path = '', body = {}, toast = true, header = null): Observable<any> {
    return this.http
      .patch(`${this.url}/${path}`, body, { headers: this.parseHeader(header) })
      .pipe(
        catchError((e: any) => {
          this.handleError(
            e.status,
            e.error.errors.msg ? e.error.errors.msg : e.statusText,
            e.error
          );
          return throwError(e);
        }),
        tap(() => (this.share.setLoadingButton = false)),
        tap(() => (this.setActiveConfirmLeave = false))
      );
  }

  get(path = '', toast = true, headers: any = null): Observable<any> {
    return this.http
      .get(`${this.url}/${path}`, { headers: this.parseHeader(headers) })
      .pipe(
        catchError((e: any) => {
          console.log(e.message);
          this.handleError(
            e.status,
            e.error.errors.msg ? e.error.errors.msg : e.statusText,
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
            e.error.errors.msg ? e.error.errors.msg : e.statusText,
            e.error
          );
          return throwError(e);
        }),
        tap(() => (this.share.setLoadingButton = false)),
        tap(() => (this.setActiveConfirmLeave = false))
      );
  }
}
