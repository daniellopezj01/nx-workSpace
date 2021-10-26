import { RestService } from './../../../../services/rest/rest.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import genderJson from '../../../../../assets/jsonFiles/gender.json';
import {
  SearchCountryField,
  CountryISO,
} from 'ngx-intl-tel-input';
import countriesJson from '../../../../../assets/jsonFiles/countries.json';
import {
  catchError,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { concat, from, Observable, of, Subject } from 'rxjs';
import * as _ from 'lodash';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-form-reservation',
  templateUrl: './form-reservation.component.html',
  styleUrls: ['./form-reservation.component.scss'],
})
export class FormReservationComponent implements OnInit {
  @ViewChild('inputPhone') inputPhone?: ElementRef;
  @Input() reservation: any;
  @Input() activeDelete = false;
  @Input() activeUpdate = false;

  public status: any = [
    {
      name: 'Completada',
      value: 'completed',
    },
    {
      name: 'En Progreso',
      value: 'progress',
    },
    {
      name: 'Cancelada',
      value: 'cancelled',
    },
    {
      name: 'Pendiente',
      value: 'pending',
    },
  ];
  public optionsButtons: any = ['save', 'list'];

  public SearchCountryField = SearchCountryField;
  public CountryISO = CountryISO;
  public loading = false;
  public reservationForm: FormGroup;
  public subForm = false;
  public today = new Date();
  public genderArray: any = genderJson;
  public changePhone = false;
  public countries: string[] = [];
  public genders: Array<any> = [];
  public userInput$ = new Subject<string>();
  public tourInput$ = new Subject<string>();
  public results$?: Observable<any>;
  public resultsTours$?: Observable<any>;
  public selectLoading = false;
  public departures: any = [];
  public ngSelectClient: any;
  public ngSelectTour: any;
  public ngSelectDeparture: any;
  public ngSelectStatus: any;
  public ngSelectCountry: any;
  public ngSelectGender: any;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private rest: RestService,
    private router: Router,
    private shared: SharedService
  ) {
    this.reservationForm = this.formBuilder.group({
      idUser: ['', [Validators.required]],
      idTour: ['', [Validators.required]],
      idDeparture: ['', [Validators.required]],
      status: ['', [Validators.required]],
      travelerFirstName: ['', [Validators.required]],
      travelerLastName: ['', [Validators.required]],
      travelerEmail: ['', [Validators.required, Validators.email]],
      travelerPhone: ['', [Validators.required]],
      travelerDocument: ['', [Validators.required]],
      travelerBirthDay: ['', [Validators.required]],
      travelerGender: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      travelerAddress: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.genders = genderJson;

    this.reservationForm.valueChanges.subscribe(() => {
      this.rest.setActiveConfirmLeave = true;
    });
    countriesJson.forEach((element: any) => {
      this.countries.push(element);
    });
    this.loadInfoSelects()
    if (this.activeUpdate) {
      this.beforeUpdate();
    }
    if (this.activeDelete) {
      this.optionsButtons.push('trash');
    }
  }

  loadInfoSelects() {
    this.results$ = this.loadSelect(this.userInput$, 'users');
    this.resultsTours$ = this.loadSelect(this.tourInput$, 'tours');
  }

  loadSelect(subject: any, type: any) {
    return concat(
      of([]), // default items
      subject.pipe(
        distinctUntilChanged(),
        tap(() => (this.selectLoading = true)),
        switchMap((term) =>
          this.singleSearch$(term, type).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => { this.selectLoading = false }),

          )
        )
      )
    );
  }

  trackByFn(item: any) {
    return item._id;
  }

  selectTour = (e: any) => {
    if (!e?._id) {
      this.departures = [];
    } else {
      this.selectLoading = false
      this.ngSelectDeparture = null;
      this.departures = e.departures;
    }
  };

  saveOrEdit() {
    if (this.activeUpdate) {
      this.updateReservation();
    } else {
      this.saveReservation();
    }
  }

  deleteReservation() {
    this.rest
      .delete(`reservations/${this.reservation._id}`)
      .subscribe((res: any) => {
        this.rest.toastSuccess(
          'Se ha Elimando la reservacion exitosamente.',
          'Reservacion Eliminada'
        );
        this.router.navigate(['/reservations']);
      });
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
      case 'tours':
        q = [
          `tours/departures?`,
          `filter=${term}`,
          `&fields=title,subTitle`,
          `&page=1&limit=5`,
          `&sort=name&order=-1`,
        ];
        break;
      default:
        break;
    }
    return this.rest
      .get(q.join(''), true, { ignoreLoadingBar: '' })
      .pipe(map((a) => a.docs));
  };

  async updateReservation() {
    let reservation;
    await this.trasnformObjectUpdate().then((a) => {
      reservation = a;
    });
    this.rest
      .patch(`reservations/${this.reservation._id}`, reservation)
      .subscribe(
        (res: any) => {
          this.rest.toastSuccess(
            'Se ha actualizado la reservacion exitosamente.',
            'Reservacion Actualizada'
          );
          this.loading = false;
          this.shared.updateReservation.emit()
        },
        (err) => {
          console.log(err);
        }
      );
  }

  async saveReservation() {
    let reservation;
    await this.trasnformObjectSave().then((a) => {
      reservation = a;
    });
    this.rest.post(`reservations`, reservation).subscribe(
      (res: any) => {
        this.loading = false;
        this.router.navigate(['/', 'reservations', res._id]);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  trasnformObjectUpdate = () =>
    new Promise((resolve) => {
      const reservation = _.clone(this.reservationForm.value);
      const {
        idTour,
        idDeparture,
        idUser,
        travelerPhone,
      } = this.reservationForm.value;
      const { internationalNumber, countryCode } = travelerPhone;
      reservation.amount = idDeparture.specialPrice || this.reservation.amount;
      reservation.idDeparture = idDeparture._id || this.reservation.idDeparture;
      reservation.travelerPhone = {
        number: internationalNumber,
        code: countryCode,
      };
      reservation.idUser = idUser._id || this.reservation.idUser;
      reservation.idTour = idTour._id || this.reservation.idTour;
      resolve(reservation);
    });

  beforeUpdate() {
    const newObject = _.clone(this.reservation);
    const {
      status,
      asUser,
      asTour,
      country,
      travelerGender,
      asDeparture,
      travelerBirthDay,
    } = this.reservation;
    this.ngSelectStatus = status;
    this.ngSelectClient = asUser;
    this.ngSelectTour = asTour;
    this.ngSelectCountry = country;
    this.ngSelectGender = travelerGender;
    this.ngSelectTour = asTour;
    this.ngSelectDeparture = asDeparture;
    newObject.travelerBirthDay = new Date(travelerBirthDay);
    this.reservationForm.patchValue(newObject);
  }

  cbList = () => {
    this.router.navigate(['/', 'reservations']);
  };

  trasnformObjectSave = () =>
    new Promise((resolve) => {
      let reservation = _.clone(this.reservationForm.value);
      const {
        internationalNumber,
        countryCode,
      } = this.reservationForm.value.travelerPhone;
      const { idTour, idDeparture, idUser } = this.reservationForm.value;
      reservation = {
        ...reservation,
        travelerPhone: {
          number: internationalNumber,
          code: countryCode,
        },
        idDeparture: idDeparture._id,
        idTour: idTour._id,
        idUser: idUser._id,
      };
      resolve(reservation);
    });
}
