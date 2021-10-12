import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError, finalize, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TripsServiceService } from './services/trips-service.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss'],
})
export class TripsComponent implements OnInit {
  loading = false;
  dataRaw: any;
  data: Array<ItemModel> = [];
  days = 1;
  nextPage = false;
  a = new Date();
  finaliCountDown: any = [];

  constructor(
    private rest: RestService,
    public tripsServiceService: TripsServiceService,
    public translate: TranslateService,
    public deviceService: DeviceDetectorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(page = 1): any {
    this.tripsServiceService.page = page;
    this.loading = true;
    const url = [
      `reservations?limit=${this.tripsServiceService.limitPerPage}`,
      `&page=${this.tripsServiceService.page}`,
    ];
    this.rest
      .get(url.join(''))
      .pipe(
        tap((a) => {
          this.dataRaw = a;
          this.loading = false;
          this.nextPage = a.nextPage;
        }),
        catchError((err) => {
          console.log(err.message);
          this.loading = err;
          return throwError(err);
        })
      )
      .subscribe(
        (res) => {
          this.data = [...res?.docs];
          this.data = _.map(this.data, (a) => {
            const { startDateDeparture } = a?.departure;
            const today = moment();
            const f = moment(startDateDeparture, 'DD-MM-YYYY').toDate();
            const final = moment(f);
            const diff = final.diff(today, 'second');
            const years = final.diff(today, 'years');
            const months = final.diff(today, 'months');
            a.departure.seconds = diff;
            a.departure.formatSecond = this.definedFormat(years, months);
            return a;

          });
        },
        (err) => {
          console.log(err.message);
        }
      );
  }

  definedFormat(years: any, months: any) {
    let format = 'dd \'días\' hh \'horas\' mm \'minutos\' ss \'segundos\'';
    if (months) {
      format = `${months % 12} 'meses' ` + format; // Oculto para cuando los meses son 0
    }
    if (years) {
      format = `${years} 'año'${years > 1 ? 's' : ''} ` + format;
    }
    return format;
  }

  stringToDate = (str: any) => moment(str, 'DD-MM-YYYY').toDate();

  pageChanged($event: PageChangedEvent) {
    this.getData($event.page);
  }

  handleEvent(e: any, id: any) {
    if (e.action === 'done') {
      this.finaliCountDown.push(id);
    }
  }

  goToDetails(item: any) {
    const { tour, code } = item;
    if (tour.status !== 'construction') {
      this.router.navigate(['/', 'trips', code]);
    }
  }
}

export class TourModel {
  attached?: Array<string>;
  title?: string;
  subTitle?: string;
  countries?: Array<any>;
  description?: string;
  status: any;
}

export class ItemModel {
  tour?: TourModel;
  departure: any;
  code?: string;
  traveller: any;
  travelerFirstName?: string;
  status: any;
  travelerLastName?: string;
  travelerPhone: any;
  // tslint:disable-next-line:variable-name
  _id?: string;
}
