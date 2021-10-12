import { ReservationService } from '../../reservation.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import countriesJson from '@assetsFiles/jsonFiles/countries.json';
// import genderJson from '@assetsFiles/jsonFiles/gender.json';
import genderJson from '../../../../assets/jsonFiles/gender.json';
import countriesJson from '../../../../assets/jsonFiles/countries.json';
import { DatePipe } from '@angular/common';
import {
  CountryISO,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { ActivatedRoute } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { Subscription, throwError } from 'rxjs';
import _ from 'lodash';
import moment from 'moment';
import { RestService } from '../../../core/services/rest.service';
import { DateValidator } from '../../../core/validations/date.validator';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  data: any;
  active = false;
  mainLoad = false;
  showInfo: any = [];
  countries: string[] = [];
  position: any;
  genderArray: any = genderJson;
  subForms = false;
  loading = false;
  auxUser: any;
  codeReservation: any;
  today = moment();
  public genders: Array<any> = [];
  public closeDeparture: any;
  public listSubscribers: any = [];

  /***Forms */
  nameForm: FormGroup;
  documentForm: FormGroup;
  birthDateForm: FormGroup;
  phoneForm: FormGroup;
  genderForm: FormGroup;
  addressForm: FormGroup;
  emailForm: FormGroup;

  squareItem = {
    title: 'RESERVATION.SQUEARE_TRAVELER_TITLE',
    description: 'RESERVATION.SQUEARE_TRAVELER_DESC',
    icon: '../../../../../assets/user/logo_personal_info.svg',
  };

  constructor(
    public translate: TranslateService,
    private activeRouter: ActivatedRoute,
    private datePipe: DatePipe,
    private rest: RestService,
    private formBuilder: FormBuilder,
    private service: ReservationService
  ) {
    this.nameForm = this.formBuilder.group({
      travelerFirstName: ['', [Validators.required]],
      travelerLastName: ['', [Validators.required]],
    });
    this.emailForm = this.formBuilder.group({
      travelerEmail: ['', [Validators.required, Validators.email]],
    });
    this.documentForm = this.formBuilder.group({
      travelerDocument: ['', [Validators.required]],
    });
    this.phoneForm = this.formBuilder.group({
      travelerPhone: ['', [Validators.required]],
    });
    this.genderForm = this.formBuilder.group({
      travelerGender: ['', [Validators.required]],
    });
    this.addressForm = this.formBuilder.group({
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      travelerAddress: ['', [Validators.required]],
    });
    this.birthDateForm = this.formBuilder.group({
      travelerBirthDay: ['', [Validators.required, DateValidator]],
    });
    this.listObserver();
  }

  ngOnInit(): void {
    this.genders = genderJson;
    this.preInit();
    this.codeReservation = this.activeRouter.snapshot?.parent?.params.id;
    this.service.setCode(this.codeReservation);
    this.loadData();
  }

  listObserver = () => {
    const observer1$ = this.service.uploadPassport.subscribe((res) => {
      this.responseSubscribe(res);
    });
    this.listSubscribers.push(observer1$);
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }

  async loadData() {
    this.loading = true;
    this.data = await this.service.getData();
    const { departure } = this.data;
    this.closeDeparture = moment(departure?.closeDateDeparture, 'DD-MM-YYYY');
    this.auxUser = _.clone(this.data);
    this.transformObject(this.data);
    this.createDataShow(this.data);
    this.loading = false;
  }

  preInit() {
    countriesJson.forEach((element: any) => {
      this.countries.push(element.name);
    });
  }

  async transformObject(data: any) {
    const { travelerGender, travelerPhone, travelerBirthDay } = data;
    if (!travelerGender) {
      this.auxUser.travelerGender = '';
    }
    if (travelerPhone) {
      this.auxUser.travelerPhone = await this.transformString(
        this.auxUser?.travelerPhone.number
      );
    }
    if (travelerBirthDay) {
      this.auxUser.travelerBirthDay = new Date(travelerBirthDay);
    }
  }

  transformString(str: string) {
    return str.substring(3, str.length);
  }


  checkDifferenceDays(): any {
    if (this.closeDeparture) {
      return this.closeDeparture.diff(this.today, 'days') < 0;
    }
    return 0
  }

  createAuxUser(user: any) {
    return JSON.parse(JSON.stringify(user));
  }

  addKey(key: any, value: any, isUpdate = true, isPhone = false) {

    this.showInfo.push({
      key,
      value: value ? value : undefined,
      isUpdate,
      isPhone,
    });
  }

  async createDataShow(data: any) {
    const {
      travelerFirstName,
      travelerLastName,
      travelerEmail,
      travelerGender,
      travelerDocument,
      travelerBirthDay,
      travelerPhone,
      imagePassPort
    } = data;
    this.addKey(
      'USER.PERSONAL_INFO.LEGAL_NAME',
      `${travelerFirstName} ${travelerLastName || ''}`,
      false,
      false
    );
    this.addKey('USER.PERSONAL_INFO.EMAIL', travelerEmail, false, false);
    this.addKey(
      'USER.PERSONAL_INFO.GENDER_KEY',
      !travelerGender ? travelerGender : await this.searchGender(travelerGender)
    );
    this.addKey('USER.PERSONAL_INFO.OFICIAL_DOCUMENT', travelerDocument);
    this.addKey(
      'USER.PERSONAL_INFO.BIRTH_DATE',
      await this.changeFormat(travelerBirthDay)
    );
    this.addKey('USER.PERSONAL_INFO.PHONE', travelerPhone, true, true);
    this.addKey('USER.PERSONAL_INFO.ADDRESS', await this.createAddress(data));
    this.addKey('USER.PERSONAL_INFO.PASSPORT', imagePassPort ? '✔ Imagen proporcionada ✔' : undefined, true, false);
    this.mainLoad = true;
  }

  changeFormat(date: any) {
    return this.datePipe.transform(date, 'dd-MMMM-yyyy');
  }

  createAddress(data: any) {
    const { travelerAddress, country, city } = data;
    return country && city && travelerAddress
      ? `${travelerAddress} - ${city} - ${country}`
      : false;
  }

  searchGender(str: string) {
    const value = this.genderArray.find((a: any) => a.value === str);
    return value.name;
  }

  buttonActive(i: any) {
    this.position = i;
    this.active = true;
  }

  cancel() {
    this.auxUser = _.clone(this.data);
    this.transformObject(this.auxUser);
    this.position = null;
    this.active = false;
  }

  isItemActive = (i: any) => this.position !== i && this.active;

  isItem = (i: any) => this.position === i && this.active;

  update(form: FormGroup) {
    this.subForms = true;
    if ('travelerPhone' in form.value) {
      const { internationalNumber, countryCode } = form.value.travelerPhone;
      form.setValue({
        travelerPhone: { number: internationalNumber, code: countryCode },
      });
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
        this.auxUser = await this.createAuxUser(this.data);
        this.showInfo = [];
        await this.createDataShow(res);
        this.service.setData(res);
        this.cancel();
      });
  }

  async responseSubscribe(res: any) {
    this.data = res;
    this.auxUser = await this.createAuxUser(this.data);
    this.showInfo = [];
    await this.createDataShow(res);
    this.service.setData(res);
    this.cancel();
  }
}
