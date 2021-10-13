import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { RestService } from '../core/services/rest.service';
import { SharedService } from '../core/services/shared.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  fromSearch = false;
  showConfirm = false;

  constructor(
    private rest: RestService,
    private cookie: CookieService,
    private sharedService: SharedService
  ) { }

  public ValidConfirmDialog(b: boolean) {
    this.fromSearch = b;
  }

  public setShowConfirm(b: boolean) {
    this.showConfirm = b;
  }

  public getShowConfirm() {
    return this.showConfirm;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[],
  ): Observable<boolean> | Promise<boolean> | boolean {
    return false;
  }

  canActivate = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const { changeRedirect } = route?.data
    this.cookie.set(`redirectUrl`, state.url, 1, '/');
    // console.log(`router ${this.router.url}`); // the url you are coming from
    return this.rest
      .checkSession(true, false, changeRedirect)
      .then((res: any) => {
        this.cookie.set(
          `currencies`,
          JSON.stringify(res?.settings?.currencies),
          environment.currenciesExpire,
          '/'
        );
        this.sharedService.getCurrencies();
        return true;
      })
      .catch((e) => {
        return false;
      });
  }

  canDeactivate() {
    return false;
  }
}
