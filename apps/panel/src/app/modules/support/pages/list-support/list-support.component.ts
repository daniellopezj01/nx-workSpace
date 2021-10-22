import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faPhoneAlt,
  faIndustry,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import {
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faUmbrellaBeach,
  faAngleDoubleRight,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { SearchService } from '../../../search/search.service';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { PaginationServiceService } from 'src/app/services/pagination/pagination-service.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-list-support',
  templateUrl: './list-support.component.html',
  styleUrls: ['./list-support.component.scss']
})
export class ListSupportComponent implements OnInit {

  @Input() viewMore: boolean = true;
  @Input() limit = 15;
  @Input() mode: string = 'page';
  public dataTake: any;
  public loading: any;
  public cbMode: any = null;
  public fields: Array<any> = [];

  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faPhoneAlt = faPhoneAlt;
  faIndustry = faIndustry;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faUmbrellaBeach = faUmbrellaBeach;

  public data: any;
  public source: string = 'support';
  public history: any = [
    {
      name: 'Soporte',
    },
  ];

  constructor(
    public pagination: PaginationServiceService,
    public search: SearchService,
    private route: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    this.pagination.init();
    this.fields = ['hash'];
    this.search.setConfig({
      fields: this.fields,
      key: this.source,
      limit: this.limit,
    });

    this.search.setConfig({
      fields: this.fields,
      key: this.source,
      limit: this.limit,
    });
    this.route.queryParams.subscribe((params) => {
      this.cbInitFilter(params);
      const { q = '' } = params;
      if (!this.data) {
        this.onSrc(q);
      }
    });
  }

  cbInitFilter = (params: any) => {
    const { filter } = params;
    if (filter) {
      const fill = {
        condition: null,
        pre: {
          label: 'FILTER.DEPOSIT',
          source: 'deposits',
          field: 'deposits',
          level: 'second',
          condition: false,
        },
        value: {
          name: filter,
        },
      };
      // this.filterService.filterSelect.push(fill);
      this.cbFilter({ filters: [fill] });
    }
  };

  /**** GLOBAL FUNCTIONS ****/

  load = (src: string = '?') => {
    this.loading = true;
    let generalParams = `&page=${this.pagination.page}&limit=${this.limit}`;
    const url = `${this.source}${src}${generalParams}`;
    this.data = this.pagination.paginationData$(url).pipe(
      tap((b: any) => {
        this.dataTake = b.docs;
        this.pagination.morePage = b.hasNextPage;
        this.pagination.paginationConfig = b;
      }),
      catchError((err) => {
        console.log(err)
        return throwError(err);
      }),
      finalize(() => (this.loading = false)),
      map((a: any) => a.docs)
    );
  };

  cbFilter($event: any = []) {
    const { filters, concat } = $event;
    // this.search.fields = this.search.fields.filter(f => f !== 'tag');
    // this.load('', false, this.search.snipQuery(this.pagination, filters,
    // concat, (!filters.length)), true);
  }


  onSrc = (e) => {
    this.pagination.src = e && e.length ? e : '';
    this.pagination.page = 1;
    this.pagination.limit = this.limit;
    this.load(this.search.snipQuery(this.pagination, this.fields));
  };

  pageChanged($event: PageChangedEvent) {
    const { page } = $event;
    this.pagination.page = page;
    this.load();
  }

  tooltip({ customData }) {
    const { travelerFirstName, travelerLastName } = customData
    return `${travelerFirstName} ${travelerLastName || ''}`
  }
}
