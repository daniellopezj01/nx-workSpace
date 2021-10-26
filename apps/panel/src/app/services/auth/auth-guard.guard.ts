import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { RestService } from '../rest/rest.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardGuard implements CanActivate {
  constructor(private auth: AuthService, private rest: RestService) {}

  canActivate() {
    return this.auth
      .checkSession(true, true)
      .then((a) => {
        return true;
      })
      .catch((e) => {
        return false;
      });
  }

  canDeactivate() {
    if (!this.rest.getActiveConfirmLeave) {
      return true;
    } else {
      return this.rest.leaveDialog();
    }
  }
}
