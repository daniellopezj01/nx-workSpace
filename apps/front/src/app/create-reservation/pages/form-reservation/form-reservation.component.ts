import genderJson from '../../../../assets/jsonFiles//gender.json';
import countriesJson from '../../../../assets/jsonFiles/countries.json';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  SearchCountryField,
  CountryISO,
} from 'ngx-intl-tel-input';
import { isPlatformBrowser } from '@angular/common';
import { QuestionsComponent } from '../questions/questions.component';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash';
import { ModalsService } from '../../../core/services/modals.service';
import { SharedService } from '../../../core/services/shared.service';
import { RestService } from '../../../core/services/rest.service';
import { ModalAlertComponent } from '../../../shared/components/modal-alert/modal-alert.component';

@Component({
  selector: 'app-form-reservation',
  templateUrl: './form-reservation.component.html',
  styleUrls: ['./form-reservation.component.scss'],
})
export class FormReservationComponent
  implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('dp') public datapicker?: any;
  // @ViewChild('dp') public datapicker?: BsDatepickerDirective;
  @ViewChild('inputPhone') public inputPhone: ElementRef | undefined;
  @Input() public departure: any;
  @Input() public tour: any;
  @Input() public intention: any;

  public SearchCountryField = SearchCountryField;
  public CountryISO = CountryISO;
  public loading = false;
  public reservationForm: FormGroup;
  public locationForm: FormGroup;
  public today = moment().toDate();
  public reservation: any = {};
  public listSubscribers: any = [];
  public questions: any;
  public agents: any;
  public countries: string[] = [];
  public genders: Array<any> = [];
  public email: any;

  constructor(
    private formBuilder: FormBuilder,
    private rest: RestService,
    private router: Router,
    private shared: SharedService,
    private render: Renderer2,
    private translate: TranslateService,
    private modalService: ModalsService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.reservationForm = this.formBuilder.group({
      travelerFirstName: ['', [Validators.required]],
      travelerLastName: ['', [Validators.required]],
      travelerEmail: ['', [Validators.required, Validators.email]],
      travelerPhone: ['', [Validators.required]],
      travelerDocument: ['', [Validators.required]],
      travelerBirthDay: ['', [Validators.required]],
      travelerGender: ['', [Validators.required]],
    });
    this.locationForm = this.formBuilder.group({
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      travelerAddress: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.listObserver();
    this.genders = genderJson;
    countriesJson.forEach((element: any) => {
      this.countries.push(element.name);
    });
    this.rest.checkSession().then((res: any) => {
      const { email } = res.user;
      this.email = email;
      this.reservationForm.patchValue({ travelerEmail: email });
      this.reservationForm.controls.travelerEmail.disable();
    });
    this.rest.get('questions').subscribe((res) => {
      this.questions = res.docs;
      if (_.find(this.questions, i => i.specialKey === 'agent')) {
        this.rest.get('users/agents').subscribe((resAgent) => {
          this.agents = resAgent
        })
      }
    });
    this.reservation.idIntention = this.intention._id;
  }

  listObserver = () => {
    const observer1$ = this.shared.loadSignature.subscribe(({ agent }) => {
      if (agent) {
        this.reservation.sellingAgent = agent;
      }
      this.saveReservation();
    });
    this.listSubscribers.push(observer1$);
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
  }

  checkDate(event: any) {
    if (event) {
      const { minAge, maxAge } = this.departure;
      let min;
      let max;
      if (minAge) {
        min = new Date(`${this.today.getFullYear() - minAge}`);
        if (moment(event).isAfter(min)) {
          this.errorDate();
        }
      }
      if (maxAge) {
        max = new Date(`${this.today.getFullYear() - maxAge}`);
        if (moment(max).isAfter(event)) {
          this.errorDate();
        }
      }
    }
  }

  errorDate() {
    let message;
    this.translate.get('GENERAL.ALERT_AGE').subscribe((res) => {
      const { minAge, maxAge } = this.departure;
      message = `${res} ${minAge} - ${maxAge || '∞'} `;
    });
    const data = { message };
    this.modalService.openComponent(
      data,
      ModalAlertComponent,
      'w-100 custom-modal-alert'
    );
    this.datapicker.bsValue = null;
  }

  // openModalTest() {
  //   const data = { questions: this.questions, agentList: this.agents };
  //   this.modalService.openComponent(data, AgentsComponent, 'big-modal w-100');
  // }

  clear() {
    this.locationForm.reset()
    this.reservationForm.reset()
    this.reservationForm.patchValue({ travelerEmail: this.email });
  }

  openModalQuestions() {
    const { travelerGender, travelerPhone } = this.reservationForm.value;
    const { internationalNumber, countryCode } = travelerPhone;
    this.reservation = {
      ...this.reservation,
      ...this.reservationForm.value,
      ...this.locationForm.value,
      travelerEmail: this.email,
      travelerGender,
      travelerPhone: {
        number: internationalNumber,
        code: countryCode
      }
    };
    const data = { questions: this.questions, agents: this.agents };
    this.modalService.openComponent(data, QuestionsComponent, 'modal-lg w-100');
  }

  saveReservation() {
    this.loading = true;
    this.rest.post(`reservations`, this.reservation, false).subscribe(
      (res) => {
        this.router.navigate([`payment/${res.code}`]);
        this.loading = false;
      },
      ({ error }) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  ngOnDestroy() {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }
}
