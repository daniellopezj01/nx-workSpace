import { ReservationService } from '../../reservation.service';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  SearchCountryField,
  CountryISO,
} from 'ngx-intl-tel-input';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import * as _ from 'lodash';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.component.html',
  styleUrls: ['./emergency.component.scss'],
})
export class EmergencyComponent implements OnInit, AfterViewChecked {
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  data: any;
  CountryISO = CountryISO;
  titleButton = 'Save';
  active = false;
  disabledItem = false;
  showInfo: any = [];
  position: any;
  loading = false;
  auxData: any;
  codeReservation: any;

  /****FORMS */
  nameForm: FormGroup;
  phoneForm: FormGroup;
  phoneOptionalForm: FormGroup;
  relationShipForm: FormGroup;
  existingDiseasesForm: FormGroup;
  bloodTypeForm: FormGroup;
  medicalAllergiesForm: FormGroup;

  squareItem = {
    title: 'RESERVATION.SQUEARE_EMERGENCY_TITLE',
    description: 'RESERVATION.SQUEARE_EMERGENCY_DESC',
    icon: '../../../../../assets/reservations/emergency-logo.svg',
  };

  constructor(
    public translate: TranslateService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private rest: RestService,
    private render: Renderer2,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private service: ReservationService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.nameForm = this.formBuilder.group({
      emergencyName: ['', [Validators.required]],
      emergencyLastName: ['', [Validators.required]],
    });
    this.phoneForm = this.formBuilder.group({
      emergencyPhone: ['', [Validators.required]],
    });
    this.phoneOptionalForm = this.formBuilder.group({
      emergencyPhoneOptional: ['', [Validators.required]],
    });
    this.relationShipForm = this.formBuilder.group({
      emergencyRelationship: ['', [Validators.required]],
    });
    this.medicalAllergiesForm = this.formBuilder.group({
      medicalAllergies: ['', [Validators.required]],
    });
    this.existingDiseasesForm = this.formBuilder.group({
      existingDiseases: ['', [Validators.required]],
    });
    this.bloodTypeForm = this.formBuilder.group({
      bloodType: ['', [Validators.required]],
    });

  }

  ngOnInit(): void {
    this.codeReservation = this.activeRouter.snapshot?.parent?.params.id;
    this.service.setCode(this.codeReservation);
    this.loadData();
  }

  ngAfterViewChecked(): void {
    if (isPlatformBrowser(this.platformId)) {
      const getElement: ElementRef | any = document.querySelector(
        `ngx-intl-tel-input .search-container input`
      );
      if (getElement && !getElement.getAttribute('autocomplete')) {
        this.render.setAttribute(getElement, 'autocomplete', 'none');
        this.render.setAttribute(getElement, 'type', 'search');
      }
    }
    this.cdRef.detectChanges();
  }

  async loadData() {
    this.loading = true;
    this.data = await this.service.getData();
    this.auxData = _.clone(this.data);
    this.createDataShow(this.data);
    this.loading = false;
  }

  async createDataShow(data: any) {
    if (data) {
      const {
        emergencyName,
        emergencyLastName,
        emergencyPhone,
        emergencyPhoneOptional,
        emergencyRelationship,
        medicalAllergies,
        existingDiseases,
        bloodType,
      } = data;
      this.addKeyName(
        'RESERVATION.EMERGENCY_FORM.NAME_KEY',
        emergencyName,
        emergencyLastName
      );
      this.addKey('RESERVATION.EMERGENCY_FORM.PHONE_KEY', emergencyPhone, true);
      this.addKey(
        'RESERVATION.EMERGENCY_FORM.PHONE_KEY_OPTIONAL',
        emergencyPhoneOptional,
        true
      );
      this.addKey(
        'RESERVATION.EMERGENCY_FORM.RELATIONSHIP',
        emergencyRelationship
      );
      this.addKey(
        'RESERVATION.EMERGENCY_FORM.MEDICAL_ALLERGIES',
        medicalAllergies
      );
      this.addKey(
        'RESERVATION.EMERGENCY_FORM.MEDICAL_HISTORY',
        existingDiseases
      );
      this.addKey('RESERVATION.EMERGENCY_FORM.BLOOD_TYPE', bloodType);
    }
  }

  addKey(key: any, value: any, isPhone: any = false) {
    this.showInfo.push({ key, value: value || undefined, isPhone });
  }

  addKeyName(key: any, name: any, lastName: any) {
    const value = name && lastName ? `${name} ${lastName}` : undefined;
    this.showInfo.push({ key, value });
  }

  activeTemplate(i: any) {
    this.position = i;
    this.active = true;
  }

  cancel() {
    this.auxData = _.clone(this.data);
    this.position = null;
    this.active = false;
  }

  isItemActive = (i: any) => this.position !== i && this.active;

  checkActiveTemplate = (i: any) => this.position === i && this.active;

  update(form: FormGroup) {
    const keys = _.keys(form.value);
    const checkFormPhone: any = _.find(
      keys,
      (i) => i === 'emergencyPhone' || i === 'emergencyPhoneOptional'
    );
    if (checkFormPhone) {
      const { internationalNumber, countryCode } = form.value[checkFormPhone];
      form.setValue({
        [checkFormPhone]: { number: internationalNumber, code: countryCode },
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
        this.auxData = _.clone(this.data);
        this.showInfo = [];
        this.service.setData(res);
        await this.createDataShow(res);
        this.cancel();
      });
  }
}
