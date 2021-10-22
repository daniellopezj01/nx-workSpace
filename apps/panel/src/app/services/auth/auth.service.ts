import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LocalStorageService } from 'ngx-localstorage';
import { RestService } from '../rest/rest.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../modules/shared/shared.service';
import { ModalWizardComponent } from '../../modules/shared/modal-wizard/modal-wizard.component';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public bsModalRef?: BsModalRef;
  public readonly url: string = environment.api;

  constructor(
    private rest: RestService,
    private router: Router,
    private modalService: BsModalService,
    private share: SharedService,
    private storageService: LocalStorageService,
    private cookieService: CookieService,
    public http: HttpClient
  ) { }

  checkSessionByToken = (token = '') => {
    try {
      this.cookieService.set(
        'session',
        token,
        environment.daysTokenExpire,
        '/'
      );
      this.rest.get(`token`, true, { ignoreLoadingBar: '' }).subscribe(
        (res) => {
          this.setterSettings(res);
          this.router.navigate(['/']);
        },
        (err) => {
          this.clear();
          this.redirectLogin();
        }
      );
    } catch (e) {
      this.clear();
      this.redirectLogin();
    }
  };

  setterSettings = (res: any) => {
    res.user = res.user || res.profile;
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
    this.storageService.set(
      'settings',
      res.settings || { logo: '', name: 'Mochileros' }
    );
    this.storageService.set('plugins', res.plugins || null);
    this.share.updateTitle(`${'Mochileros'} ${environment.title}`);
  };

  public login = (data: any) =>
    new Promise((resolve, reject) => {
      this.rest.post(`login`, data).subscribe(
        (res) => {

          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });

  public exchange({ accessToken }: any): Observable<any> {
    return this.http.post(`${this.url}/exchange`, { accessToken });
  }

  public clear = () => {
    this.cookieService.delete('session', '/');
    this.cookieService.delete('user', '/');
  };

  public updateUser = (key: any, value: any) => {
    try {
      const user = JSON.parse(this.cookieService.get('user'));
      user[key] = value;
      this.cookieService.set(
        'user',
        JSON.stringify(user),
        environment.daysTokenExpire,
        '/'
      );
    } catch (e) {
      console.log(e)
    }
  };

  public logout = () =>
    new Promise((resolve, reject) => {
      try {
        this.clear();
        resolve(true);
      } catch (e) {
        reject(false);
      }
    });

  public openWizard = (data: any = {}) => {
    const initialState = {
      section: data,
    };
    this.bsModalRef = this.modalService.show(ModalWizardComponent, {
      class: 'modal-wizard',
      initialState: data,
      // animated: false
    });
  };

  getCurrentUser = () => {
    try {
      return JSON.parse(this.cookieService.get('user'));
    } catch (e) {
      return null;
    }
  };

  checkSession = (verify = false, redirect = true, extra: any = {}) => {
    return new Promise((resolve, reject) => {
      if (this.cookieService.check('session')) {
        this.rest.get(`token`, true, { ignoreLoadingBar: '' }).subscribe(
          (res) => {
            const { user, settings } = res;
            if (
              user &&
              user.role === 'admin' &&
              (!settings?.currency ||
                !settings?.logo ||
                !settings?.currencySymbol ||
                !settings?.name)
            ) {
              // this.openWizard();
            }
            if (res.parentAccount && res.parentAccount.status) {
              this.share.limitAccount.emit(res.parentAccount);
            }
            this.setterSettings(res);
            reject(false);
          },
          (error) => {
            this.clear();
            this.redirectLogin();
          }
        );
        resolve(true);
      } else {
        redirect ? this.redirectLogin() : null;
        resolve(false);
      }
    });
  };

  redirectLogin = () => {
    this.router.navigate(['/', 'auth', 'login']);
  };
}
