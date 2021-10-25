import { RestService } from './../../../../services/rest/rest.service';
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import {ModalUserComponent} from "../modal-user/modal-user.component";
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import {
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { concat, forkJoin, from, Observable, of, Subject } from 'rxjs';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-form-tour',
  templateUrl: './form-tour.component.html',
  styleUrls: ['./form-tour.component.scss'],
})
export class FormTourComponent implements OnInit {
  @Input() public activeDelete = false;
  @Input() public activeUpdate = false;
  @Input() public data: any;
  public form: FormGroup;
  public users: any = [];
  private codePaymentMexico = environment.codePaymentMexico;
  public url = '';
  public continents: any = [];
  public categories: any = [];
  public payments: any = [];
  public bsModalRef?: BsModalRef;
  public loading = true;
  public activeAgency = false
  public tagsInput$ = new Subject<string>();
  public userInput$ = new Subject<string>();
  public agencyInput$ = new Subject<string>();
  public results$?: Observable<any>;
  public resultsAgency$?: Observable<any>;
  public resultsTags$?: Observable<any>;
  public selectCategories: any[] = [];
  public selectTags: any[] = [];
  public selectContinents: any[] = [];
  public selectLoading = false;
  public ngSelectStatus: any;
  public ngSelectLenguages: any;
  public ngSelectAgency: any;
  public ngSelectPayments: any;
  public optionsButtons: any = ['save', 'list'];
  public status: any = [
    {
      name: 'Publico',
      value: 'publish',
    },
    {
      name: 'Oculto',
      value: 'draft',
    },
    {
      name: 'Borrador',
      value: 'construction',
    },
  ];
  public lenguages: any = [
    {
      name: 'Español',
      value: 'ES',
    },
    {
      name: 'Ingles',
      value: 'EN',
    },
  ];
  public addTagNowRef: (name: any) => void;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private shared: SharedService,
    public router: Router,
    private rest: RestService
  ) {
    this.addTagNowRef = this.addTagNow.bind(this);
    this.form = this.formBuilder.group({
      idUser: [''],
      title: ['', Validators.required],
      subTitle: ['', Validators.required],
      countries: ['', Validators.required],
      cities: ['', Validators.required],
      duration: ['', Validators.required],
      route: ['', Validators.required],
      status: ['', [Validators.required]],
      category: ['', Validators.required],
      tags: [''],
      paymentMethod: ['', Validators.required],
      description: ['', Validators.required],
      specialInfo: [''],
      accountAgency: [''],
      continent: ['', Validators.required],
      lenguages: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const requestCategories = this.rest.get('categories?limit=50');
    const requestContinents = this.rest.get(`tours/allContinents?limit=50`);
    const requestPayments = this.rest.get(`paymentMethods`);
    this.loading = true;
    forkJoin([requestCategories, requestContinents, requestPayments])
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: any) => {
        this.categories = res[0].docs;
        this.continents = res[1].docs;
        this.payments = res[2].docs;
      });


    this.loadInfoSelects()
    if (this.activeUpdate) {
      this.beforeUpdate();
    }
    if (this.activeDelete) {
      this.optionsButtons.push('trash');
    }
  }

  loadInfoSelects() {
    this.resultsTags$ = this.loadSelect(this.tagsInput$, 'tags');
    this.results$ = this.loadSelect(this.userInput$, 'users');
    this.resultsAgency$ = this.loadSelect(this.agencyInput$, 'agency');
  }

  loadSelect(subject: any, type: any) {
    return concat(
      of([]), // default items
      subject.pipe(
        distinctUntilChanged(),
        tap(() => (this.selectLoading = true)),
        switchMap((term) =>
          this.singleSearch$(term, type).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.selectLoading = false))
          )
        )
      )
    );
  }

  beforeUpdate() {
    this.form.patchValue(this.data);
    const { slug } = this.data;
    this.url = `${environment.front}/destination/${slug}`;
    this.data.idUser = this.data?.manager || {};
    this.loading = false
    const {
      status,
      lenguages,
      category,
      continent,
      tags,
      paymentMethod,
      agency
    } = this.data;
    this.ngSelectStatus = status;
    this.ngSelectLenguages = lenguages;
    this.selectCategories = category
    this.selectContinents = continent
    this.selectTags = tags
    this.ngSelectPayments = paymentMethod
    if (agency) {
      this.activeAgency = true
      this.ngSelectAgency = agency
    }
  }

  trackByFn(item: any): any {
    return item._id;
  }

  selectPayment({ codePayment }: any) {
    if (codePayment === this.codePaymentMexico) {
      this.activeAgency = true
    } else {
      this.activeAgency = false
      this.ngSelectAgency = null
      this.form.patchValue({ accountAgency: null })
    }
  }

  singleSearch$ = (term: any, typeUrl: any) => {
    let q;
    switch (typeUrl) {
      case 'users':
        q = [
          `users?`,
          `filter=${term}`,
          `&fields=name,email,surname`,
          `&page=1&limit=5`,
          `&sort=name&order=-1`,
        ];
        break;
      case 'tags':
        q = [
          `tags?`,
          `filter=${term}`,
          `&fields=name`,
          `&page=1&limit=4`,
          `&sort=name&order=-1`,
        ];
        break;
      case 'agency':
        q = [
          `users/agencies?`,
          `filter=${term}`,
          `&fields=name,email,surname`,
          `&page=1&limit=4`,
          `&sort=name&order=-1`,
        ];
        break;
      default:
        break;
    }
    return this.rest
      .get(q?.join(''), true, { ignoreLoadingBar: '' })
      .pipe(map((a) => a.docs));
  };

  cbList = () => {
    this.router.navigate(['/', 'tours']);
  };

  deleteTour(): any {
    this.rest.delete(`tours/${this.data._id}`).subscribe((res: any) => {
      this.rest.toastSuccess(
        'Se ha Eliminado el tour exitosamente.',
        'Tour Eliminado'
      );
      this.router.navigate(['/', 'tours']);
    });
  }

  onSubmit(): any {
    if (this.activeUpdate) {
      this.updateTour();
    } else {
      this.saveTour();
    }
  }

  saveTour() {
    this.loading = true;
    const body = this.trasnformObjectCreate(this.form.value);
    this.rest.post(`tours`, body)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (res: any) => {
          this.rest.toastSuccess('Tour Creado', 'Tour Creado Exitosamente');
          this.router.navigate(['/', 'tours', res._id]);
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  async updateTour() {
    const object = this.trasnformObjectUpdate(this.form.value)
    this.rest
      .patch(`tours/${this.data._id}`, object)
      .subscribe(
        (res: any) => {
          this.rest.toastSuccess(
            'Se ha actualizado el Tour exitosamente.',
            'Tour Actualizado'
          );
          this.loading = false;
          this.shared.updateTour.emit()
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  trasnformObjectCreate(object: any) {
    const { duration } = object;
    object.duration = parseInt(duration)
    if (this.ngSelectAgency) {
      object.accountAgency = this.ngSelectAgency.accountStripe
    }
    return object;
  }

  trasnformObjectUpdate(object: any) {
    const { duration } = object;
    object.duration = parseInt(duration)
    if (this.ngSelectAgency) {
      object.accountAgency = this.ngSelectAgency.accountStripe
    }
    return object;
  }

  addTagFn($event: any): any {
    console.log($event);
  }

  addTagNow(name: any): any {
    return new Promise((resolve) => {
      const object = { name }
      this.selectLoading = true;
      this.rest.post('tags', object).subscribe(
        (res: any) => {
          this.selectLoading = false
          resolve(object)
        },
        (err: any) => {
          this.selectLoading = false
          this.rest.showToast('')
        })
    })
  }
}
