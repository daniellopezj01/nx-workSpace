import { RestService } from './../../../../core/services/rest.service';
import { ModalsService } from './../../../../core/services/modals.service';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import { FilterFlightComponent } from '../filter-flight/filter-flight.component';
import { MainSearchService } from '../../main-search.service';
import { debounceTime } from 'rxjs/operators';
import { FlightsService } from '../services/flights.service';
import { FilterFlightService } from '../services/filter-flight.service';
import { ErrorHandlingComponent } from '../error-handling/error-handling.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-container-flight',
  templateUrl: './container-flight.component.html',
  styleUrls: ['./container-flight.component.scss'],
})
export class ContainerFlightComponent implements OnInit, OnDestroy {
  public listSubscribers: any = [];
  public params: any = {};
  public loading = false;
  public adults?: number;
  public children?: number;
  public loadingSecondary = false;
  public data: Array<any> = [];
  public page = 1;
  public loadingFilters = false;
  public limitFilters: any = {
    maxPrice: 0,
    maxDuration: 0,
    maxStops: [0],
  };
  public currencyExchange: any;
  public from = '';
  public to = '';
  public fromToArrive: any

  constructor(
    private router: Router,
    private flightService: FlightsService,
    private filterFlight: FilterFlightService,
    private mainSearchService: MainSearchService,
    private modalService: ModalsService,
    private rest: RestService
  ) { }

  ngOnInit(): void {
    this.params = this.flightService.defaultParams;
    this.getDataFirstTime()
    this.listObserver();
  }

  listObserver = () => {
    const observer1$ = this.filterFlight.changeFilters.subscribe((result) => {
      this.getDataFirstTime()
    });
    const observer2$ = this.filterFlight.changeCurrentFilters.subscribe((result) => { //filtros del buscador principal, 
      const { data } = result;
      this.flightService.page = 1
      const dataNew = data;
      const parseData = this.flightService.simulatePagination(dataNew, false, true);
      this.data = [...parseData];
    });
    const observer3$ = this.flightService.loadData.pipe(debounceTime(100)).subscribe((res: any) => {
      console.log('entre a loadData en container Flight', res)
      // debugger
      /**
       * C: ID city
       * E: Adults number
       * F: Children number
       */
      this.requestData()
    });
    this.listSubscribers = [observer1$, observer2$, observer3$];
  }

  getDataFirstTime() {
    const defaultParams = this.flightService.defaultParams
    const globalParams: any = this.mainSearchService.getParamsKey()
    const { segments = [], checkIn: defaultCheckIn, checkOut: defaultCheckOut } = defaultParams
    let { origin, destination, } = globalParams
    const { checkIn, checkOut } = globalParams
    origin = this.extratCodeAirport(origin) || segments[0].origin
    destination = this.extratCodeAirport(destination) || segments[0].destination
    this.params = {
      adultsCount: globalParams.adultsCount || defaultParams.adultsCount,
      childrenCount: globalParams.childrenCount || defaultParams.childrenCount,
      segments: [
        {
          origin,
          destination,
          date: checkIn || defaultCheckIn,
        },
        {
          origin: destination,
          destination: origin,
          date: checkOut || defaultCheckOut,
        },
      ]
    }
    this.requestData()
  }

  extratCodeAirport(string = '') {
    const array = string.match(/\(.*?\)/g)
    if (array) {
      const code: string = _.head(array) || ''
      return code.replace(/[()]/g, '')
    }
    return null
  }

  ngOnDestroy() {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }

  requestData() {
    this.loading = true;
    this.rest
      .post('plugins/sabre/events/getAllData', { params: this.params }, false)
      .subscribe(
        (res: any) => {
          const { data, params } = res;
          this.flightService.globalParamsRequest = params
          const { segments, adultsCount, childrenCount } = this.params
          this.fromToArrive = segments
          this.flightService.rawData = data;
          this.data = this.flightService.simulatePagination(data);
          this.adults = adultsCount
          this.children = childrenCount
          this.filterFlight.begin(this.data);
          this.loading = false
        },
        (err) => {
          console.log(err)
          this.loading = false
          // this.openError()
        }
      );
  }

  openError() {
    const data = { errorTitle: 'SEARCH_TITLE', errorDescription: 'SEARCH_DESCRIPTION', };
    this.modalService.openComponent(
      data,
      ErrorHandlingComponent,
      'modal-md w-100',
      true
    );
  }

  changeFilter($event: any) {
    this.data = $event;
    this.page = 1;
  }

  openFilters() {
    const data = {
      limit: this.limitFilters,
    };
    this.modalService.openComponent(
      data,
      FilterFlightComponent,
      'modal-filters-flights'
    );
  }

  moreData() {
    const nextData = this.flightService.getNextPage();
    this.data = [...this.data, ...nextData];
  }
}
