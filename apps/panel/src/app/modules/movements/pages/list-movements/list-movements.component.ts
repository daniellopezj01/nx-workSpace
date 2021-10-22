import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {

  faUser,
  faArrowDown,
  faArrowUp,
  faMoneyBillAlt
} from '@fortawesome/free-solid-svg-icons';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import {
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from '@fortawesome/free-solid-svg-icons';
// import {FilterServiceService} from '../../../../components/list-items/filter-service.service';
import {
  finalize,
  map,
  tap,
} from 'rxjs/operators';
import {
  Observable,
  of,
  zip,
} from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PaginationServiceService } from 'src/app/services/pagination/pagination-service.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { SearchService } from 'src/app/modules/search/search.service';
import { AddMovementComponent } from '../add-movement/add-movement.component';
import { ModalsService } from 'src/app/modules/shared/modals.service';

@Component({
  selector: 'app-list-movements',
  templateUrl: './list-movements.component.html',
  styleUrls: ['./list-movements.component.scss'],
})
export class ListMovementsComponent implements OnInit {
  @Input() mode = 'page';
  @Input() title: any = false;
  @Input() limit: any = 15;
  @Input() viewMore = true;
  @Input() dataTake: any;
  @Output() cbClick = new EventEmitter<any>();

  @Input() data: Observable<any>;
  public cbMode: any = null;
  public currency: any = null;
  public currencySymbol: any = null;
  public loading: any;
  public fields: Array<any> = [];

  constructor(
    private share: SharedService,
    private route: ActivatedRoute,
    public pagination: PaginationServiceService,
    public auth: AuthService,
    public search: SearchService,
    private router: Router,
    private modalService: ModalsService
  ) { }

  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faArrowDown = faArrowDown;
  faArrowUp = faArrowUp;
  faUser = faUser;
  faMoneyBillAlt = faMoneyBillAlt;
  public page = 1;
  public source = 'payOrders';

  public history: any = [
    {
      name: 'payOrders',
    },
  ];

  ngOnInit(): void {
    this.pagination.init();
    // this.search.fields = [];
    // this.search.filters = [];
    // this.filterService.filterSelect = [];
    this.fields = ['description', 'idOperation', 'status', 'platform', 'code'];
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
    this.share.saveOrder.subscribe((res) => {
      const s1$ = of([res]);
      const s2$ = this.data.pipe(map((a) => a));
      this.data = zip(s1$, s2$).pipe(map((res) => [].concat(...res)));
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
    console.log(inside);
    this.router.navigate(['/', 'movements', inside?._id]);
  };

  /**** GLOBAL FUNCTIONS ****/

  cbPdf(): any {
    // this.pdf.generateList({source: this.source, page: this.page, data: this.dataTake});
  }

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

  goTo = () => {
    const data = {};
    this.modalService.openComponent(
      data,
      AddMovementComponent,
      'modal-light-plan'
    );
    // modal-light-plan
  };

  onSrc = (e) => {
    this.pagination.src = e && e.length ? e : '';
    this.pagination.page = 1;
    this.pagination.limit = this.limit;
    this.load(this.search.snipQuery(this.pagination, this.fields));
  };

  cbFilter($event: any = []): any {
    // const {filters, concat} = $event;
    // this.search.fields = this.search.fields.filter(f => f !== 'tag');
    // this.load('', false, this.search.snipQuery(this.pagination, filters,
    // concat, (!filters.length)), true);
  }

  paginate = () => {
    this.pagination.page = this.pagination.page + 1;
    this.load();
  };

  pageChanged($event: PageChangedEvent): any {
    const { page } = $event;
    this.pagination.page = page;
    this.load();
    // this.load(this.pagination.src, false, this.search.snipQuery(this.pagination, [],
    // true));
  }
}
