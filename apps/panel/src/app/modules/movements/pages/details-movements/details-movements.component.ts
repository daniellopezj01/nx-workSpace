import { RestService } from './../../../../services/rest/rest.service';
import { MovementsService } from './../../movements.service';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import {
  catchError,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { concat, Observable, of, Subject } from 'rxjs';
import { SharedService } from '../../../shared/shared.service';
@Component({
  selector: 'app-details-movements',
  templateUrl: './details-movements.component.html',
  styleUrls: ['./details-movements.component.scss'],
})
export class DetailsMovementsComponent implements OnInit, AfterContentChecked {
  @ViewChild('placesRef') placesRef?: GooglePlaceDirective;
  @Input() id: any;

  public optionsSelect: any = [
    { name: 'Monedero', value: 'wallet' },
    { name: 'Compra', value: 'reservation' },
  ];
  public ngSelectTypeEvent: any;
  /***Status */
  public ngSelectStatus: any;
  public status: any = [
    {
      name: 'Exitoso',
      value: 'succeeded',
    },
    {
      name: 'En Progreso',
      value: 'await',
    },
    {
      name: 'Fallida',
      value: 'failure',
    },
  ];
  /***platform */
  public ngSelectPlatform: any;
  public platform: any = [];
  public history: any = [
    {
      name: 'Movimientos',
      router: ['/', 'movements'],
    },
  ];

  public loadingButton = false;
  /***Users */
  public results$?: Observable<any>;
  public userInput$ = new Subject<string>();
  public loadingUser = false;
  /***Reservations */
  public resultsReservation$?: Observable<any>;
  public reservationInput$ = new Subject<string>();
  public loadingReservations = false;

  public form: FormGroup;
  public loading: any;
  public order: any;

  constructor(
    private http: HttpClient,
    public share: SharedService,
    private rest: RestService,
    private router: Router,
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private service: MovementsService,
  ) {
    this.form = this.formBuilder.group({
      operationType: ['', Validators.required],
      valueSelectType: [''],
      status: ['', Validators.required],
      idOperation: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', Validators.required],
      platform: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.rest.setActiveConfirmLeave = true;
    this.platform = this.service.platform
    this.route.params.subscribe((params) => {
      this.id = params.id;
    });

    this.loadUsers();
    this.loadReservations();
    this.loadGeneral();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  loadGeneral = () => {
    this.loading = true;
    this.rest.get(`payOrders/${this.id}`).subscribe(
      (res) => {
        this.order = res;
        this.destructureObject();
        this.loading = false;
      },
      (err) => {
        console.error(err);
        this.router.navigate(['/']);
      }
    );
  };

  cbTrash() {
    this.rest.delete(`payOrders/${this.order._id}`).subscribe((res) => {
      this.rest.toastSuccess(
        'Se ha Elimando la Order exitosamente.',
        'Orden Eliminada'
      );
      this.router.navigate(['/movements']);
    });
  }

  destructureObject() {
    const object = _.clone(this.order);
    const { creator, reservation } = this.order;
    const check = object.idReservation;
    object.operationType = check ? 'reservation' : 'wallet';
    this.ngSelectTypeEvent = check ? reservation : creator;
    this.form.patchValue(object);
  }

  eventTypeOperation(event: any) {
    this.form.patchValue({ valueSelectType: null });
    // console.log(this.selectOperation);
  }

  private loadUsers() {
    this.results$ = concat(
      of([]), // default items
      this.userInput$.pipe(
        distinctUntilChanged(),
        tap(() => (this.loadingUser = true)),
        switchMap((term) =>
          this.singleSearch$(term, 'users').pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.loadingUser = false))
          )
        )
      )
    );
  }
  private loadReservations() {
    this.resultsReservation$ = concat(
      of([]), // default items
      this.reservationInput$.pipe(
        distinctUntilChanged(),
        tap(() => (this.loadingReservations = true)),
        switchMap((term) =>
          this.singleSearch$(term, 'reservations').pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.loadingReservations = false))
          )
        )
      )
    );
  }
  singleSearch$ = (term: any, typeUrl: any) => {
    let q: any;
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
      case 'reservations':
        q = [
          `reservations/all?`,
          `filter=${term}`,
          `&fields=code,travelerName,travelerEmail`,
          `&page=1&limit=5`,
          `&sort=code&order=-1`,
        ];
        break;
      default:
        break;
    }
    return this.rest
      .get(q.join(''), true, { ignoreLoadingBar: '' })
      .pipe(map((a) => a.docs));
  };

  async updateGeneralData() {
    let object;
    await this.transformForUpdate().then((res) => {
      object = res;
    });
    this.rest
      .patch(`payOrders/fromPanel/${this.order._id}`, object)
      .subscribe((res) => {
        this.rest.toastSuccess(
          'Se ha actualizado la Operacion exitosamente.',
          'Operacion Actualizada'
        );
      });
  }

  transformForUpdate = () =>
    new Promise((resolve) => {
      const object: any = _.clone(this.form.value);
      const { valueSelectType, amount } = this.form.value;
      if (object['operationType'] === 'wallet') {
        const { _id } = valueSelectType;
        object.idUser = _id;
      } else {
        const { idUser, _id } = valueSelectType;
        object.idUser = idUser;
        object.idReservation = _id;
      }
      object.amount = parseFloat(amount);
      resolve(object);
    });
}
