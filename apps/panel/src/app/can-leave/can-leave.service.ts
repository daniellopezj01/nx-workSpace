import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { flatMap, first, tap, map } from 'rxjs/operators';
import { RestService } from '../services/rest/rest.service';

export type CanLeaveType = boolean | Promise<boolean> | Observable<boolean>;

@Injectable()
export class CanLeaveService implements CanDeactivate<any> {
  private observer$ = new BehaviorSubject<CanLeaveType>(true);

  constructor(private rest: RestService) {}

  /** Pushes a quanding value into the guard observer to resolve when leaving the page */
  public allowDeactivation(guard: CanLeaveType) {
    this.observer$.next(guard);
  }

  // Implements the CanDeactivate interface to conditionally prevent leaving the page
  canDeactivate(): Observable<any> {
    // Debug
    return this.rest.leaveDialog();
  }
}
