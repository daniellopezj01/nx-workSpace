import { ReservationService } from '../../reservation.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import genderJson from '@assetsFiles/jsonFiles/gender.json';
import { DatePipe } from '@angular/common';
import {
  SearchCountryField,
  CountryISO,
} from 'ngx-intl-tel-input';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as _ from 'lodash';
import { RestService } from '../../../core/services/rest.service';
import { DateValidator } from '../../../core/validations/date.validator';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.scss'],
})
export class BuyerComponent implements OnInit {
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  data: any;
  active = false;
  showInfo: any = [];
  position: any;
  genderArray: any = genderJson;
  loading = false;
  auxUser: any;
  codeReservation: any;

  nameForm: FormGroup;
  documentForm: FormGroup;
  birthDateForm: FormGroup;
  phoneForm: FormGroup;
  emailForm: FormGroup;

  squareItem = {
    title: 'RESERVATION.SQUEARE_TRAVELER_TITLE',
    description: 'RESERVATION.SQUEARE_TRAVELER_DESC',
    icon: '../../../../../assets/user/logo_personal_info.svg',
  };

  constructor(
    public translate: TranslateService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private datePipe: DatePipe,
    private rest: RestService,
    private service: ReservationService,
    private formBuilder: FormBuilder
  ) {
    this.nameForm = this.formBuilder.group({
      buyerFirstName: ['', [Validators.required]],
      buyerLastName: ['', [Validators.required]],
    });
    this.documentForm = this.formBuilder.group({
      buyerDocument: ['', [Validators.required]],
    });
    this.emailForm = this.formBuilder.group({
      buyerEmail: ['', [Validators.required, Validators.email]],
    });
    this.phoneForm = this.formBuilder.group({
      buyerPhone: ['', [Validators.required]],
    });
    this.birthDateForm = this.formBuilder.group({
      buyerBirthDay: ['', [Validators.required, DateValidator]],
    });
  }

  ngOnInit(): void {
    this.codeReservation = this.activeRouter.snapshot.parent?.params.id;
    this.service.setCode(this.codeReservation);
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    this.data = await this.service.getData();
    this.auxUser = _.clone(this.data);
    this.transformObject(this.data);
    this.createDataShow(this.data);
    this.loading = false;
  }

  async createDataShow(data: any) {
    const {
      buyerFirstName,
      buyerLastName,
      buyerEmail,
      buyerDocument,
      buyerBirthDay,
      buyerPhone,
    } = data;
    this.addKeyName(
      'USER.PERSONAL_INFO.LEGAL_NAME',
      buyerFirstName,
      buyerLastName
    );
    this.addKey('USER.PERSONAL_INFO.EMAIL', buyerEmail);
    this.addKey('USER.PERSONAL_INFO.OFICIAL_DOCUMENT', buyerDocument);
    this.addKey(
      'USER.PERSONAL_INFO.BIRTH_DATE',
      await this.changeFormat(buyerBirthDay)
    );
    this.addKey('USER.PERSONAL_INFO.PHONE', buyerPhone, true);
  }

  changeFormat(date: any) {
    return this.datePipe.transform(date, 'dd-MMMM-yyyy');
  }

  addKeyName(key: any, name: any, lastName: any) {
    const value = name && lastName ? `${name} ${lastName}` : undefined;
    this.showInfo.push({ key, value });
  }

  addKey(key: any, value: any, isPhone = false) {
    this.showInfo.push({ key, value: value ? value : undefined, isPhone });
  }

  searchGender(str: string) {
    const value = this.genderArray.find((a: any) => a.value === str);
    return value.name;
  }

  buttonActive(i: any) {
    this.position = i;
    this.active = true;
  }
  async transformObject(data: any) {
    const { buyerBirthDay } = data;
    if (buyerBirthDay) {
      this.auxUser.buyerBirthDay = new Date(buyerBirthDay);
    }
  }

  cancel() {
    this.auxUser = _.clone(this.data);
    this.transformObject(this.data);
    this.position = null;
    this.active = false;
  }

  isItemActive = (i: any) => this.position !== i && this.active;
  isItem = (i: any) => this.position === i && this.active;

  update(form: FormGroup) {
    if ('buyerPhone' in form.value) {
      if (form.value.buyerPhone !== null) {
        const { internationalNumber, countryCode } = form.value.buyerPhone;
        form.setValue({
          buyerPhone: { number: internationalNumber, code: countryCode },
        });
      } else {
        return;
      }
    }
    this.loading = true;
    this.rest
      .patch(`reservations/${this.data._id}`, form.value)
      .pipe(
        tap(() => (this.loading = false)),
        catchError((err) => {
          this.loading = err;
          return throwError(err);
        })
      )
      .subscribe(async (res) => {
        this.data = res;
        this.auxUser = _.clone(this.data);
        this.showInfo = [];
        await this.createDataShow(res);
        this.service.setData(res);
        this.cancel();
      });
  }

  changeFormatDate(date: any) {
    return { buyerBirthDay: this.datePipe.transform(date, 'MM-dd-yyyy') };
  }
}
