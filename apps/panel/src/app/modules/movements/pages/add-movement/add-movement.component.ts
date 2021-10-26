import { RestService } from './../../../../services/rest/rest.service';
import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import _ from 'lodash';
import moment from 'moment';
import {
  catchError,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { concat, Observable, of, Subject } from 'rxjs';
import { MovementsService } from '../../movements.service';
import { ModalsService } from '../../../shared/modals.service';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-add-movement',
  templateUrl: './add-movement.component.html',
  styleUrls: ['./add-movement.component.scss'],
})
export class AddMovementComponent implements OnInit, AfterViewChecked {
  @Input() saveFromReservation = false;
  @Input() reservation: any;
  public data: any = {};
  public today = new Date();
  public ngSelectTypeEvent: any;
  public selectOperation: any;
  public form: FormGroup;
  public loadingButton = false;
  public disabledSelect = false;
  /***Users */
  public results$: Observable<any> = new Observable<Array<any>>();
  public userInput$ = new Subject<string>();
  public loadingUser = false;
  /***Reservations */
  public resultsReservation$: Observable<any> = new Observable<Array<any>>();
  public reservationInput$ = new Subject<string>();
  public loadingReservations = false;
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
    this.platform = this.service.platform

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
  getDate(formControl: any) {
    return moment(this.form.value[formControl]).toDate();
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

  async save() {
    this.loadingButton = true;
    let object;
    await this.createObjectPost().then((a) => {
      object = a;
    });
    this.rest.post('payOrders', object).subscribe((res: any) => {
      this.rest.toastSuccess(
        'Se ha creado la operacion exitosamente.',
        'Operacion creada'
      );
      this.shared.saveOrder.emit(res);
      this.modal.close();
      this.loadingButton = false;
    });
  }

  transformPrice(number: number) {
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
