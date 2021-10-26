import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { RestService } from '../core/services/rest.service';
import { SharedService } from '../core/services/shared.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsGuardGuard implements CanActivate {
  constructor(
    private rest: RestService,
    private cookieService: CookieService,
    private sharedService: SharedService
  ) { }

  getSettings() {
    return new Promise((resolve, reject) => {
      this.rest.get(`settings/check`).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          reject(null);
        }
      );
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    // return true;
    this.cookieService.set(`redirectUrl`, state.url, 1, '/');
    return this.getSettings()
      .then((res: any) => {
        this.cookieService.set(
          `currencies`,
          JSON.stringify(res?.currencies),
          environment.currenciesExpire,
          '/'
        );
        this.sharedService.getCurrencies();
        return true;
      })
      .catch((err) => {
        return false;
      });
  }
}
