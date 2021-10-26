import { TemplatesHeadersService } from './../templates-headers.service';
import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MainSearchService } from '../../../../search/pages/main-search.service';
import { RestService } from 'apps/front/src/app/core/services/rest.service';


@Component({
  selector: 'app-template-deals',
  templateUrl: './template-deals.component.html',
  styleUrls: ['./template-deals.component.scss'],
})
export class TemplateDealsComponent implements OnInit, AfterContentChecked {
  public tours: any = [];
  public loading: boolean = false
  itemList: Array<any> = [
    {
      text: 'SHARED.SEE_ALL_DEALS',
      action: 'categories',
      value: 'ofertas'
    },
  ];

  constructor(
    private router: Router,
    public translate: TranslateService,
    private rest: RestService
  ) { }

  ngOnInit(): void {
    this.loading = true
    this.rest.get('tours?limit=4').subscribe((res: any) => {
      this.tours = res.docs;
      this.loading = false;
    });
  }

  ngAfterContentChecked(): void { }

  gotoDetails(tour: any) {
    this.router.navigate([`/destination/${tour.slug}`]);
  }

  actionItem(item: any) {
    this.router.navigate([`/search/tours`])
  }
}
