import { PaginationServiceService } from './../../../../services/pagination/pagination-service.service';
/* eslint-disable @angular-eslint/component-selector */
import { AuthService } from './../../../../services/auth/auth.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
// import {FilterServiceService} from '../../../../components/list-items/filter-service.service';
import { finalize, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SharedService } from '../../../shared/shared.service';
import { SearchService } from '../../../search/search.service';

@Component({
  selector: 'app-list-tours',
  templateUrl: './list-tours.component.html',
  styleUrls: ['./list-tours.component.scss'],
})
export class ListToursComponent implements OnInit {
  @Input() public mode = 'page';
  @Input() public title: any = false;
  @Input() public limit: any = 15;
  @Input() public viewMore = true;
  @Input() public simpleView = false;
  @Input() public dataTake: any;
  @Input() public data?: Observable<any>;
  @Output() public cbClick = new EventEmitter<any>();

  public cbMode: any = null;
  public currency: any = null;
  public currencySymbol: any = null;
  public loading: any;
  public fields: Array<any> = [];
  public faAngleDoubleLeft = faAngleDoubleLeft;
  public faAngleDoubleRight = faAngleDoubleRight;
  public faAngleLeft = faAngleLeft;
  public faAngleRight = faAngleRight;
  public faPhoneAlt = faPhoneAlt;
  public faIndustry = faIndustry;
  public faUser = faUser;
  public page = 1;
  public source = 'tours';
  private toAdd = 'tours';
  public history: any = [
    {
      name: 'tours',
    },
  ];
  constructor(
    private share: SharedService,
    private route: ActivatedRoute,
    public pagination: PaginationServiceService,
    // public filterService: FilterServiceService,
    public auth: AuthService,
    public search: SearchService,
    private router: Router
  ) { }



  ngOnInit(): void {
    this.pagination.init();
    // this.search.fields = [];
    // this.search.filters = [];
    // this.filterService.filterSelect = [];
    this.fields = ['title', 'route', 'subTitle', 'slug'];
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

  emitCbClick = (inside: any = {}) => {
    this.router.navigate(['/', 'tours', inside?._id]);
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

  goTo = () => this.share.goTo(this.toAdd);

  onSrc = (e: any) => {
    this.pagination.src = e && e.length ? e : '';
    this.pagination.page = 1;
    this.pagination.limit = this.limit;
    this.load(this.search.snipQuery(this.pagination, this.fields));
  };

  cbFilter($event: any = []) {
    const { filters, concat } = $event;
    // this.search.fields = this.search.fields.filter(f => f !== 'tag');
    // this.load('', false, this.search.snipQuery(this.pagination, filters,
    // concat, (!filters.length)), true);
  }

  paginate = () => {
    this.pagination.page = this.pagination.page + 1;
    this.load();
  };

  pageChanged($event: PageChangedEvent) {
    const { page } = $event;
    this.pagination.page = page;
    this.load();
    // this.load(this.pagination.src, false, this.search.snipQuery(this.pagination, [],
    // true));
  }
}
