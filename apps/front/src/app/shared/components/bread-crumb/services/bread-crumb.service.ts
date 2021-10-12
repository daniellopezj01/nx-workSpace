import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as _ from 'lodash';

export interface History {
  route: string;
  key?: string;
  level?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BreadCrumbService {
  public breadCrumbs = Array<any>();
  public currentLevel = 0;
  public currentUrl = '';

  constructor(router: Router) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ url }: any) => {
        this.currentUrl = url;
        this.breadCrumbs = _.compact(url.split('/'));
        const head = _.head(this.breadCrumbs);
        if (head === 'trips' || head === 'referred') {
          this.breadCrumbs.unshift('user');
        }
      });
  }

  setCurrentLevel(level: number) {
    this.currentLevel = level;
  }

}

