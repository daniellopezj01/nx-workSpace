import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { TemplatesHeadersService } from '../templates-headers.service';
import { MainSearchService } from '../../../../search/pages/main-search.service';
import { SharedService } from 'apps/front/src/app/core/services/shared.service';

@Component({
  selector: 'app-template-way-travel',
  templateUrl: './template-way-travel.component.html',
  styleUrls: ['./template-way-travel.component.scss'],
})
export class TemplateWayTravelComponent implements OnInit, OnDestroy {
  tours: any = [];
  public listSubscribers: any = [];
  public loading = true;

  constructor(
    public service: TemplatesHeadersService,
    private router: Router,
    public translate: TranslateService,
    private shared: SharedService
  ) {
  }

  categories: any = [];

  ngOnInit(): void {
    this.shared.dataCategories.subscribe(res => {
      this.loading = false;
      this.categories = res;
    });
    this.shared.getCategories();
  }

  gotoCategory(category: any) {
    const { slug } = category;
    this.router.navigate([`/search/tours`], {
      queryParams: { category: slug },
    });
  }

  ngOnDestroy() {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }

}
