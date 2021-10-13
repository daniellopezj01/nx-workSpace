import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import genderJson from '../../../../assets/jsonFiles/gender.json';
import countriesJson from '../../../../assets/jsonFiles/countries.json';
import { DatePipe } from '@angular/common';
import {
  SearchCountryField,
  CountryISO,
} from 'ngx-intl-tel-input';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DateValidator } from '../../../core/validations/date.validator';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit, AfterViewChecked {
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  user: any;
  titleButton = 'Save';
  active = false;
  disabledItem = false;
  mainLoad = false;
  showInfo: any = [];
  countries: string[] = [];
  position: any;
  genderArray: any = genderJson;
  subForms = false;
  loading = false;
  auxUser: any;
  dateValid = false;
  nameForm: FormGroup;
  documentForm: FormGroup;
  birthDateForm: FormGroup;
  phoneForm: FormGroup;
  genderForm: FormGroup;
  addressForm: FormGroup;
  descriptionForm: FormGroup;
  public genders: Array<any> = [];

  squareItem = {
    title: 'USER.PERSONAL_INFO.SQUARE_TITLE_PERSON_INFO',
    description: 'USER.PERSONAL_INFO.SQUARE_DESC_PERSON_INFO',
    icon: '../../../../../assets/user/logo_personal_info.svg',
  };

  constructor(
    public translate: TranslateService,
    private datePipe: DatePipe,
    private rest: RestService,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.nameForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
    });
    this.documentForm = this.formBuilder.group({
      document: ['', [Validators.required]],
    });
    this.phoneForm = this.formBuilder.group({
      phone: ['', [Validators.required]],
    });
    this.genderForm = this.formBuilder.group({
      gender: ['', [Validators.required]],
    });
    this.addressForm = this.formBuilder.group({
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
    this.descriptionForm = this.formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(50)]],
    });
    this.birthDateForm = this.formBuilder.group({
      birthDate: ['', [Validators.required, DateValidator]],
    });
    this.preInit();
  }

  preInit() {
    countriesJson.forEach((element: any) => {
      this.countries.push(element.name);
    });
    this.user = this.rest.getCurrentUser();
  }

  ngOnInit(): void {
    this.genders = genderJson;
    this.loading = true;
    this.rest
      .get(`profile`)
      .pipe(
        tap(() => (this.loading = false)),
        catchError((err) => {
          this.loading = err;
          return throwError(err);
        })
      )
      .subscribe(
        async (res) => {
          this.user = res;
          this.auxUser = await this.createAuxUser(this.user);
          this.transformObject(this.user);
          this.createDataShow(res);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  async transformObject(data: any) {
    if (!data?.gender) {
      this.auxUser.gender = '';
    }
    if (data?.phone) {
      this.auxUser.phone = await this.transformString(
        this.auxUser.phone.number
      );
    }
    this.auxUser.birthDate = new Date(data.birthDate);
  }

  transformString(str: string) {
    return str.substring(3, str.length);
  }

  createAuxUser(user: any) {
    return JSON.parse(JSON.stringify(user));
  }

  typeaheadOnBlur(event: any): void {
    this.fAddress.country.setValue(event.item);
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  get fAddress() {
    return this.addressForm.controls;
  }

  async createDataShow(data: any) {
    this.addKey(
      'USER.PERSONAL_INFO.LEGAL_NAME',
      `${data?.name} ${data?.surname || ''}`
    );
    this.addKey('USER.PERSONAL_INFO.EMAIL', data.email, false);
    this.addKey(
      'USER.PERSONAL_INFO.GENDER_KEY',
      !data?.gender ? data?.gender : await this.searchGender(data?.gender)
    );
    this.addKey('USER.PERSONAL_INFO.OFICIAL_DOCUMENT', data?.document);
    this.addKey(
      'USER.PERSONAL_INFO.BIRTH_DATE',
      await this.changeFormat(data?.birthDate)
    );
    this.addKey('USER.PERSONAL_INFO.PHONE', data?.phone, true, true);
    this.addKey('USER.PERSONAL_INFO.ADDRESS', await this.createAddress(data));
    this.addKey('USER.PERSONAL_INFO.DESCRIPTION', data?.description);
    this.mainLoad = true;
  }

  addKey(key: any, value: any, isUpdate = true, isPhone = false) {
    this.showInfo.push({
      key,
      value: value ? value : undefined,
      isUpdate,
      isPhone,
    });
  }

  changeFormat(date: any) {
    return this.datePipe.transform(date, 'dd-MMMM-yyyy');
  }

  createAddress(data: any) {
    const { city, country, address } = data;
    return city && country && address
      ? `${country} - ${city} - ${address}`
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
    this.auxUser = JSON.parse(JSON.stringify(this.user));
    this.transformObject(this.auxUser);
    this.position = null;
    this.active = false;
  }

  isItemActive = (i: any) => this.position !== i && this.active;
  isItem = (i: any) => this.position === i && this.active;

  update(form: FormGroup) {
    this.subForms = true;
    if ('phone' in form.value) {
      const { phone } = form.value;
      const { internationalNumber, countryCode } = phone;
      form.setValue({
        phone: { number: internationalNumber, code: countryCode },
      });
    }
    if ('birthDate' in form.value) {
      form.setValue(this.changeFormatDate(form.value.birthDate));
    }
    this.loading = true;
    this.rest.patch(`profile`, form.value).subscribe(
      async (res) => {
        this.user = res;
        this.auxUser = await this.createAuxUser(this.user);
        this.showInfo = [];
        await this.createDataShow(res);
        this.loading = false;
        this.cancel();
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  changeFormatDate(date: any) {
    return { birthDate: this.datePipe.transform(date, 'MM-dd-yyyy') };
  }
}
