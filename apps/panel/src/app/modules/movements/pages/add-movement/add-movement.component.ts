import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { RestService } from 'src/app/services/rest/rest.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
  catchError,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { concat, from, iif, Observable, of, Subject } from 'rxjs';
import { ModalsService } from 'src/app/modules/shared/modals.service';
import { MovementsService } from '../../movements.service';

@Component({
  selector: 'app-add-movement',
  templateUrl: './add-movement.component.html',
  styleUrls: ['./add-movement.component.scss'],
})
export class AddMovementComponent implements OnInit {
  @Input() saveFromReservation: boolean = false;
  @Input() reservation: any;
  public data: any = {};
  public today = new Date();
  public ngSelectTypeEvent: any;
  public selectOperation: any;
  public form: FormGroup;
  public loadingButton: boolean = false;
  public disabledSelect: boolean = false;
  /***Users */
  public results$: Observable<any>;
  public userInput$ = new Subject<string>();
  public loadingUser: boolean;
  /***Reservations */
  public resultsReservation$: Observable<any>;
  public reservationInput$ = new Subject<string>();
  public loadingReservations: boolean;
  public optionsSelect: any = [
    { name: 'Monedero', value: 'wallet' },
    { name: 'Compra', value: 'reservation' },
  ];
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
  /***Status */
  public ngSelectPlatform: any;
  public platform: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private shared: SharedService,
    public modal: ModalsService,
    private rest: RestService,
    private cdRef: ChangeDetectorRef,
    private service: MovementsService,
  ) { }

  ngOnInit(): void {
    this.platform = this.service.platform
    this.form = this.formBuilder.group({
      operationType: ['', Validators.required],
      valueSelectType: [''],
      status: ['', Validators.required],
      idOperation: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', Validators.required],
      platform: ['', Validators.required],
    });
    if (this.saveFromReservation) {
      this.disabledSelect = true;
      this.selectOperation = 'reservation';
      this.ngSelectTypeEvent = this.reservation;
    }
    this.loadUsers();
    this.loadReservations();
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  getDate(formControl) {
    return moment(this.form.value[formControl]).toDate();
  }
  eventTypeOperation(event) {
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
  singleSearch$ = (term, typeUrl) => {
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

  async save() {
    this.loadingButton = true;
    let object;
    await this.createObjectPost().then((a) => {
      object = a;
    });
    this.rest.post('payOrders', object).subscribe((res) => {
      this.rest.toastSuccess(
        'Se ha creado la operacion exitosamente.',
        'Operacion creada'
      );
      this.shared.saveOrder.emit(res);
      this.modal.close();
      this.loadingButton = false;
    });
  }

  transformPrice(number) {
    const array = _.split(number.toString(), '.');
    return _.map(array).join(',');
  }
  createObjectPost = () =>
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
