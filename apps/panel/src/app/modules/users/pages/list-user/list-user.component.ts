import { PaginationServiceService } from './../../../../services/pagination/pagination-service.service';
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
  faAngleDoubleRight,
} from '@fortawesome/free-solid-svg-icons';
import { SearchService } from '../../../search/search.service';
import { finalize, map, tap } from 'rxjs/operators';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
})
export class ListUserComponent implements OnInit {
  @Input() public viewMore = true;
  @Input() public limit = 15;
  @Input() public mode = 'page';
  public dataTake: any;
  public loading: any;
  public cbMode: any = null;
  public fields: Array<any> = [];
  public data: any;
  public source = 'users';
  public history: any = [
    {
      name: 'Usuarios',
    },
  ];

  public faAngleDoubleLeft = faAngleDoubleLeft;
  public faAngleDoubleRight = faAngleDoubleRight;
  public faAngleLeft = faAngleLeft;
  public faAngleRight = faAngleRight;
  public faPhoneAlt = faPhoneAlt;
  public faIndustry = faIndustry;
  public faUser = faUser;

  constructor(
    public pagination: PaginationServiceService,
    public search: SearchService,
    private route: ActivatedRoute,
    private share: SharedService
  ) { }

  ngOnInit(): void {
    this.pagination.init();
    this.fields = [
      'name',
      'surname',
      'email',
      'document',
      'description',
      'status',
    ];
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
    const generalParams = `&page=${this.pagination.page}&limit=${this.limit}`;
    const url = `${this.source}${src}${generalParams}`;
    this.data = this.pagination.paginationData$(url).pipe(
      tap((b: any) => {
        this.dataTake = b.docs;
        this.pagination.morePage = b.hasNextPage;
        this.pagination.paginationConfig = b;
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

  goTo = () => this.share.goTo(this.source);

  onSrc = (e: any) => {
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
}
