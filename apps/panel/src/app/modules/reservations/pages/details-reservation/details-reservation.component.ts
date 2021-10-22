import { RestService } from './../../../../services/rest/rest.service';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  SearchCountryField,
  CountryISO,
} from 'ngx-intl-tel-input';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Router } from '@angular/router';
import { MovementsService } from '../../../movements/movements.service';
import { ModalsService } from '../../../shared/modals.service';
import { SharedService } from '../../../shared/shared.service';
import { AddMovementComponent } from '../../../movements/pages/add-movement/add-movement.component';

@Component({
  selector: 'app-details-reservation',
  templateUrl: './details-reservation.component.html',
  styleUrls: ['./details-reservation.component.scss'],
})
export class DetailsReservationComponent implements OnInit, AfterContentChecked {
  @Input() id: any;
  @ViewChild('placesRef') placesRef?: GooglePlaceDirective;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  public today = new Date();
  columns = [
    { key: 'RESERVATION.CODE' },
    { key: 'RESERVATION.DATE' },
    { key: 'RESERVATION.DESCRIPTION' },
    { key: 'RESERVATION.PLATFORM' },
    { key: 'RESERVATION.STATUS' },
    { key: 'RESERVATION.AMOUNT' },
  ];

  public reservation: any;
  public history: any = [
    {
      name: 'Reservations',
      router: ['/reservations'],
    },
    {
      name: 'Detalles',
      router: null,
    },
  ];
  public listSubscribers: any = [];
  public formBuyer: FormGroup;
  public formPrice: FormGroup;
  public formEmergency: FormGroup;
  public preview = {
    image: null,
    blob: null,
  };
  files: File[] = [];
  taxList = [];
  taxListOffset = [];

  public bsModalRef?: BsModalRef;
  public currencies = [];
  public loading = true;
  public selectedTemplate: any;
  public activeUpdateAmount = false;

  constructor(
    public share: SharedService,
    private rest: RestService,
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    private cdref: ChangeDetectorRef,
    private router: Router,
    private modalService: ModalsService,
    private movementService: MovementsService,
    private shared: SharedService
  ) {
    this.formBuyer = this.formBuilder.group({
      buyerFirstName: ['', Validators.required],
      buyerLastName: ['', Validators.required],
      buyerDocument: ['', Validators.required],
      buyerEmail: ['', Validators.required],
      buyerPhone: ['', Validators.required],
      buyerBirthDay: ['', Validators.required],
    });
    this.formEmergency = this.formBuilder.group({
      emergencyName: ['', Validators.required],
      emergencyLastName: ['', Validators.required],
      emergencyPhone: ['', Validators.required],
    });
    this.formPrice = this.formBuilder.group({
      amount: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.rest.setActiveConfirmLeave = true;


    this.loadGeneral();
    this.share.saveOrder.subscribe((res) => {
      this.reservation.transactions.push(res);
      this.reservation.pendingAmount = parseFloat(
        (this.reservation.pendingAmount - res.amount).toFixed(2)
      );
    });
    this.share.updateReservation.subscribe(res => {
      this.loadGeneral()
    })
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  searchPlatform(value: any) {
    return this.movementService?.searchPlatform(value)
  }

  loadGeneral = () => {
    this.rest.get(`reservations/getDetails/${this.id}`).subscribe(
      (res) => {
        this.reservation = res;
        const { buyerBirthDay } = res;
        if (buyerBirthDay) {
          this.reservation.buyerBirthDay = new Date(buyerBirthDay);
        }
        this.history.push({
          name: this.reservation.code,
          router: null,
        });
        this.share.changeHistory.emit(this.history);
        this.formBuyer.patchValue(this.reservation);
        this.formEmergency.patchValue(this.reservation);
        this.loading = false;
      },
      (err) => {
        this.rest.setActiveConfirmLeave = false;
        this.router.navigate(['/reservations']);
      }
    );
  };

  updateData(Typeform = true) {
    const form = Typeform ? this.formBuyer : this.formEmergency;
    const reservation = _.clone(form.value);
    if (Typeform) {
      reservation.buyerBirthDay = new Date(form.value.buyerBirthDay);
    }
    const { internationalNumber, countryCode } = form.value[
      Typeform ? 'buyerPhone' : 'emergencyPhone'
    ];
    reservation[Typeform ? 'buyerPhone' : 'emergencyPhone'] = {
      number: internationalNumber,
      code: countryCode,
    };
    this.rest
      .patch(`reservations/${this.reservation._id}`, reservation)
      .subscribe((res) => {
        this.rest.toastSuccess(
          'Se ha actualizado la Reservacion exitosamente.',
          'Reserva Actualizada'
        );
      });
  }

  updateAMount() {
    const { amount } = this.formPrice.value
    this.rest
      .patch(`reservations/${this.reservation._id}`, { amount: parseInt(amount) })
      .subscribe(() => {
        this.rest.toastSuccess(
          'Se ha actualizado la Reservacion exitosamente.',
          'Reserva Actualizada'
        );
        this.shared.updateReservation.emit()
        this.activeUpdateAmount = false
      });
  }

  openModalTransactions() {
    const data = { reservation: this.reservation, saveFromReservation: true };
    this.modalService.openComponent(
      data,
      AddMovementComponent,
      'modal-light-plan'
    );
  }
}
