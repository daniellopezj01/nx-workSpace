import { RestService } from './../../../../services/rest/rest.service';
import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { concat, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReferrealsService } from './referreals.service';

@Component({
  selector: 'app-referreals',
  templateUrl: './referreals.component.html',
  styleUrls: ['./referreals.component.scss']
})
export class ReferrealsComponent implements OnInit {

  @Input() public id: any;
  @Input() public user: any;
  public form: FormGroup;
  public data: any;
  public dataRaw: any;
  public total = 0;
  public loading = false;
  public faCheckCircle = faCheckCircle;

  /***PLAN */
  public planLoading = false;
  public planInput$ = new Subject<string>();
  public resultsPlan$?: Observable<any>;
  public ngSelectPlan: any;
  /** */

  columns = [
    { key: 'USER.TYPE_REFERREALS.TABLE.CODE' },
    { key: 'USER.TYPE_REFERREALS.TABLE.USER' },
    { key: 'USER.TYPE_REFERREALS.TABLE.PLAN' },
    { key: 'USER.TYPE_REFERREALS.TABLE.RECEIVE_AMOUN' },
    { key: 'USER.TYPE_REFERREALS.TABLE.SEND_AMOUNT' },
    { key: 'USER.TYPE_REFERREALS.TABLE.STATUS' },
    { key: 'USER.TYPE_REFERREALS.TABLE.DATE' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private rest: RestService,
    private library: FaIconLibrary,
    public translate: TranslateService,
    public referrealService: ReferrealsService,
    public deviceService: DeviceDetectorService,
  ) {
    library.addIcons(faCheckCircle);
    this.form = this.formBuilder.group({
      typeReferred: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadPlanReferred();
    this.getData();
    if (this.user) {
      this.ngSelectPlan = this.user.plan
    }
  }

  getData(page = 1): any {
    this.referrealService.page = page;
    this.loading = true;
    const url = [
      `users/referreals/${this.id}?limit=${this.referrealService.limitPerPage}`,
      `&page=${this.referrealService.page}`,
    ];
    this.rest
      .get(url.join(''))
      .pipe(
        finalize(() => (this.loading = false)),
        tap((o) => {
          this.dataRaw = o;
          this.loading = false;
        }),
        map((b) => b.docs)
      )
      .subscribe((res: any) => {
        this.data = res;
      });
  }

  private loadPlanReferred() {
    this.resultsPlan$ = concat(
      of([]), // default items
      this.planInput$.pipe(
        distinctUntilChanged(),
        tap(() => (this.planLoading = true)),
        switchMap((term) =>
          this.singleSearch$(term, 'plan').pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.planLoading = false))
          )
        )
      )
    );
  }

  singleSearch$ = (term: string, typeUrl: string) => {
    let q: any;
    switch (typeUrl) {
      case 'plan':
        q = [
          `referredSettings?`,
          `filter=${term}`,
          `&fields=name,label`,
          `&page=1&limit=4`,
          `&sort=name&order=-1`,
        ];
        break;
      default:
        break;
    }
    return this.rest
      .get(q.join(''), true, { ignoreLoadingBar: '' })
      .pipe(map((a) => a.docs));
  };


  async updatePlan() {
    this.loading = true;
    let referred;
    await this.trasnformObjectUpdate().then((a) => {
      referred = a;
      console.log(referred)
    });
    this.rest.patch(`users/${this.user._id}`, referred).subscribe(
      () => {
        this.user.plan = this.ngSelectPlan
        this.rest.toastSuccess(
          'Se ha actualizado el plan referido exitosamente.',
          'Usuario Actualizado'
        );
        this.loading = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  trasnformObjectUpdate = () =>
    new Promise((resolve) => {
      const { typeReferred } = this.form.value
      resolve({ typeReferred: typeReferred._id });
    });

  selectPlan(e: any) {
    console.log(e)
  }

  pageChanged($event: PageChangedEvent) {
    this.getData($event.page);
  }

}
