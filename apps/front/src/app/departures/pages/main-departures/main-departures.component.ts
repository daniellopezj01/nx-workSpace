import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  OnDestroy,
  OnInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { catchError, tap } from 'rxjs/operators';
import { Subscription, throwError } from 'rxjs';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { DepartureService } from '../../services/departure.service';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-main-departures',
  templateUrl: './main-departures.component.html',
  styleUrls: ['./main-departures.component.scss'],
})
export class MainDeparturesComponent implements OnInit, OnDestroy {
  public activeDepartures: any = {};
  public loading = false;
  public key: any;
  public data: any;
  public dataRaw: any;
  public listSubscribers: any = [];
  public selectCities = [];
  public isLogged = false;
  public discounts: [] = [];

  constructor(
    private active: ActivatedRoute,
    private translate: TranslateService,
    private rest: RestService,
    public datePipe: DatePipe,
    public service: DepartureService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.key = this.active.snapshot.params.query;
  }

  ngOnInit(): void {
    this.loadData();
    this.listObserver();
    this.isLogged = this.rest.checkIsLogged();
  }

  listObserver = () => {
    const observer1$ = this.service.selectItem.subscribe((item) => {
      this.activeDepartures = item;
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          const el: HTMLElement | null = document.getElementById(
            this.isLogged ? 'stepTwo' : 'Login'
          );
          if (el) {
            window.scrollTo({ top: el.offsetTop - 30, behavior: 'smooth' });
          }
        }, 20);
      }
      if (this.isLogged) {
        this.service.nextStep.emit(this.activeDepartures);
      }
    });
    const observer2$ = this.service.activeSession.subscribe((islogged) => {
      this.isLogged = islogged;
      this.service.nextStep.emit(this.activeDepartures);
    });
    this.listSubscribers.push(observer1$, observer2$);
  }

  loadData = () => {
    this.loading = true;
    this.rest
      .get(`tours/departures/${this.key}`)
      .pipe(
        tap(() => (this.loading = false)),
        catchError((err) => {
          this.loading = err;
          return throwError(err);
        })
      )
      .subscribe(
        (res: any) => {
          this.data = res;
          this.generatePaginate();
        },
        (err) => {
          console.log(err);
        }
      );
  }

  gotoReservation(): void {
    this.service.goToReservation.emit();
  }

  ngOnDestroy() {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }

  generatePaginate(page = 1) {
    const end = page * this.service.limitPerPage;
    const begin = end - this.service.limitPerPage;
    const { departures } = this.data;
    this.dataRaw = _.slice(departures, begin, end);
  }

  pageChanged($event: PageChangedEvent) {
    this.generatePaginate($event.page);
  }
}
