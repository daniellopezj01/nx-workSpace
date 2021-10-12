import { RestService } from './../../../../../../core/services/rest.service';
import { FlightDetailsService } from './../../flight-details.service';
import { Component, OnDestroy, OnInit, Input, AfterViewChecked, Renderer2, ElementRef, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { FlightsService } from '../../../services/flights.service';
import {
  SearchCountryField,
  CountryISO,
} from 'ngx-intl-tel-input';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import genderJson from '@assetsFiles/jsonFiles/gender.json';
import *  as moment from 'moment'
import *  as _ from 'lodash'
import { Subscription } from 'rxjs';
// import *  as faker from 'faker'

@Component({
  selector: 'app-from-pnr',
  templateUrl: './from-pnr.component.html',
  styleUrls: ['./from-pnr.component.scss']
})
export class FromPnrComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() code?: string;
  @Input() adults = 1;
  @Input() childrens = 0;
  public activeStep?: boolean;
  private listobservable: any = [];
  public numberForms?: number = 1;
  public SearchCountryField = SearchCountryField;
  public CountryISO = CountryISO;
  public loadingButton?: boolean = false;
  public genders: Array<any> = [];
  public pnrForm: FormGroup;
  public emergencyForm: FormGroup;
  public today = moment().toDate();

  constructor(
    private service: FlightsService,
    private formBuilder: FormBuilder,
    private render: Renderer2,
    private rest: RestService,
    private router: Router,
    private cdref: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: any,
    private detailsService: FlightDetailsService
  ) {
    this.pnrForm = this.formBuilder.group({
      passengers: this.formBuilder.array(this.createItems())
    });
    this.emergencyForm = this.formBuilder.group({
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.genders = genderJson;
    this.listObserver()
  }

  get passengersFormArr(): FormArray {
    return this.pnrForm.get('passengers') as FormArray;
  }


  createItems(): FormGroup[] {
    const array: FormGroup[] = []
    this.numberForms = (this.adults + this.childrens) || 0
    for (let i = 0; i < this.numberForms; i++) {
      array.push(this.formBuilder.group({
        name: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        type: [i < this.adults ? 'ADT' : 'CNN'],
        passDocument: ['', [Validators.required]],
        // passDocument: ['' + faker.random.number(1000000000, 9999999999), [Validators.required]],
        gender: ['', [Validators.required]],
        dateOfBirth: ['', [Validators.required]],
      }))
    }
    return array
  }

  listObserver() {
    const observerOne = this.service.beginWithPnr.subscribe(res => {
      this.activeStep = res
    })
    this.listobservable.push(observerOne)
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
    this.cdref.detectChanges();
  }

  onValueChangeDate(date: any) {
    if (date) {
      console.log(this.transformDate(date))
    }
  }

  // stringToDate(str): any {
  //   return moment(str, 'YYYY-MM-DD').toDate();
  // }

  transformDate(date: any): any {
    return moment(date).format('YYYY-MM-DD');
  }

  ngOnDestroy(): void {
    this.listobservable.forEach((a: Subscription) => a.unsubscribe());
  }
  transformAllDates(passengers = []) {
    const object = _.map(passengers, (i: any) => {
      return {
        ...i,
        dateOfBirth: this.transformDate(i.dateOfBirth),
        passDocument: `NI${i.passDocument}`
      }
    })
    return object
  }

  sendForm() {
    this.loadingButton = true
    const passengers = this.transformAllDates(this.pnrForm.value.passengers)
    const params = {
      code: this.code,
      passengers,
      emergency: this.emergencyForm.value
    }
    this.rest.post('plugins/sabre/events/saveInfoPassengersPnr', { params }).subscribe(
      res => {
        this.loadingButton = false
        this.detailsService.setInfoflight(res)
        this.router.navigate(['search', 'flights', 'confirm', this.code])
      }, err => {
        console.log(err)
      })
  }
}
