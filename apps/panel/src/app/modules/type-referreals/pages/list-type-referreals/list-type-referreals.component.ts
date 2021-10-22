import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faPhoneAlt,
  faIndustry,
  faUser,
  faTag
} from '@fortawesome/free-solid-svg-icons';


import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import {
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';
// import {FilterServiceService} from '../../../../components/list-items/filter-service.service';
import { finalize, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PaginationServiceService } from 'src/app/services/pagination/pagination-service.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { SearchService } from 'src/app/modules/search/search.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list-type-referreals',
  templateUrl: './list-type-referreals.component.html',
  styleUrls: ['./list-type-referreals.component.scss']
})
export class ListTypeReferrealsComponent implements OnInit {

  @Input() mode: string = 'page';
  @Input() title: any = false;
  @Input() limit: any = 15;
  @Input() viewMore: boolean = true;
  @Input() dataTake: any;
  @Input() data: Observable<any>;
  @Output() cbClick = new EventEmitter<any>();

  private toAdd = 'type-referrals';

  public cbMode: any = null;
  public currency: any = null;
  public currencySymbol: any = null;
  public loading: any;
  public fields: Array<any> = [];
  public page: number = 1;
  public source = 'referredSettings';
  public history: any = [
    {
      name: 'type Referreals',
    },
  ];

  /***ICONS */
  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faPhoneAlt = faPhoneAlt;
  faIndustry = faIndustry;
  faUser = faUser;
  faTag = faTag;
  faMoneyBillWave = faMoneyBillWave;

  constructor(
    private share: SharedService,
    private route: ActivatedRoute,
    public pagination: PaginationServiceService,
    public datePipe: DatePipe,
    // public filterService: FilterServiceService,
    public auth: AuthService,
    public search: SearchService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pagination.init();
    this.fields = [];
    this.fields = ['label', 'name'];
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
    this.router.navigate(['/', 'type-referrals', inside?._id]);
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
      finalize(() => (this.loading = false)),
      map((a: any) => a.docs)
    );
  };

  goTo = () => this.share.goTo(this.toAdd);

  onSrc = (e) => {
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
