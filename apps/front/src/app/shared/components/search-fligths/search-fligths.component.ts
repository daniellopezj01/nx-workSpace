import { FilterFlightService } from './../../../search/pages/flights/services/filter-flight.service';
import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  faMapMarkerAlt,
  faMinus,
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import _ from 'lodash';
import moment from 'moment';
import { MainSearchService } from '../../../search/pages/main-search.service';
import { FlightsService } from '../../../search/pages/flights/services/flights.service';
import { SharedService } from '../../../core/services/shared.service';
import { RestService } from '../../../core/services/rest.service';


@Component({
  selector: 'app-search-fligths',
  templateUrl: './search-fligths.component.html',
  styleUrls: ['./search-fligths.component.scss'],
})
export class SearchFligthsComponent implements OnInit, OnDestroy {
  @Input() fromHome = false;

  public formSearch: FormGroup;
  public listSubscribers: any = [];
  public globalParams: any;
  public today = new Date();
  public focusSearch: any;
  public focusPerson = false;
  public searchFrom = '';
  public searchTo = '';
  public dataPlaces: any;
  public faMinus = faMinus;
  public faPlus = faPlus;
  public notFound = false;
  public currentParams: any = {}
  public request: any;
  public adultsCount = 1;
  public childrenCount = 0;
  public loadingSearch = false;
  public dataPlaces$: Observable<any> | undefined;
  public start: any;
  public end: any;
  public bsOptions = {
    showWeekNumbers: false,
    isAnimated: false,
    rangeInputFormat: 'DD-MMM-YYYY',
  };
  public bsRangeValue?: any = undefined;
  public inputFrom?: boolean = false;
  public typeFlight = '';

  constructor(
    private library: FaIconLibrary,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private mainSearchService: MainSearchService,
    private flightService: FlightsService,
    private datePipe: DatePipe,
    private rest: RestService,
    private shared: SharedService,
    private FilterService: FilterFlightService
  ) {
    library.addIcons(faMapMarkerAlt, faSearch);
    this.formSearch = this.formBuilder.group({
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      dates: ['', [Validators.required]],
      people: [''],
    });
    // this.bsRangeValue = ['',''];
  }

  ngOnInit(): void {

    if (!this.fromHome) {
      this.listObserver();
    }
    const observer = this.shared.changeInputFlight.subscribe((res) => {
      if (res) {
        this.focusSearch = res === 'idInputFrom' ? 'from' : 'to'
      } else {
        this.focusSearch = false
      }
    })
    this.listSubscribers.push(observer)
  }

  listObserver = () => {
    /**
     * Load defaults parameters from Service
     */
    this.route.queryParams.subscribe(() => {
      const defaultParams = this.flightService.defaultParams
      this.globalParams = this.mainSearchService.getParamsKey();
      const paramsFromUrl = _.pick(this.globalParams, this.flightService.arrayParms)
      this.currentParams = { ...defaultParams, ...paramsFromUrl }
      const { checkIn, checkOut, adultsCount, childrenCount, origin, destination } = this.currentParams;
      const defaultPlaces = this.structureDefaultLocation()
      this.searchFrom = origin || defaultPlaces[0]
      this.searchTo = destination || defaultPlaces[1]
      this.bsRangeValue = [moment(checkIn, 'YYYY-MM-DD').toDate(), moment(checkOut, 'YYYY-MM-DD').toDate()];
      this.adultsCount = adultsCount;
      this.childrenCount = childrenCount;
      this.formSearch.patchValue({
        from: this.searchFrom,
        to: this.searchTo,
      });
      this.bsRangeValue = [moment(checkIn, 'YYYY-MM-DD').toDate(), moment(checkOut, 'YYYY-MM-DD').toDate()];
    });
  }

  ngOnDestroy() {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }

  structureDefaultLocation() {
    const items = this.flightService.preLoadIds[0]
    const array = []
    array.push(`${items?.from?.name} (${items?.from.code})`.toUpperCase())
    array.push(`${items?.to?.name} (${items?.to?.code})`.toUpperCase())
    return array
  }

  getPlaces(event: any) {
    // event = event ? event.replace(/[\[\]\(\)']+/g, '') : '';
    event = event ? event.replace(/[[\]()']+/g, '') : '';
    const body = { params: { lang: 'es', term: event, limit: 6 } };
    if (event.length) {
      this.dataPlaces$ = this.rest
        .post(`plugins/travelpayouts-api-fligths/events/search_airports`, body)
        .pipe(
          tap((a) => (this.dataPlaces = a))
        );
    }
  }

  onFocus(type: any) {
    this.focusSearch = type;
  }

  onBlur(type = null) {
    this.focusSearch = null;
  }

  onFocusPerson() {
    this.focusPerson = true;
  }

  alignedPlace(place: any, input: any) {
    if (input === 'from') {
      this.searchFrom = `${place?.name} (${place?.code})`.toUpperCase();
    }
    if (input === 'to') {
      this.searchTo = `${place?.name} (${place?.code})`.toUpperCase();
    }
  }

  selectedPlace(place: any) {
    this.alignedPlace(place, this.focusSearch);
    this.onBlur(this.focusSearch);
  }

  search() {
    // if (this.formSearch.valid) {
    const { from, to } = this.formSearch.value;
    const checkIn = moment(this.bsRangeValue[0]).format('YYYY-MM-DD').toString()
    const checkOut = moment(this.bsRangeValue[1]).format('YYYY-MM-DD').toString()
    const properties = {
      origin: from,
      destination: to,
      checkIn,
      checkOut,
      adultsCount: this.adultsCount,
      childrenCount: this.childrenCount
    }
    if (this.fromHome) {
      const globalParams = this.mainSearchService.getGlobalParams
      this.router.navigate([`/search/flights`], {
        queryParams: { ...globalParams, ...properties },
      });
    } else {
      this.mainSearchService.setParams(properties, this.FilterService);
    }
  }

  changeValuesPerson(item: string, flag = 1) {
    if (item === 'adults') {
      this.adultsCount = Number(String(this.adultsCount)) + (flag > 0 ? 1 : -1);
    }
    if (item === 'children') {
      this.childrenCount =
        Number(String(this.childrenCount)) + (flag > 0 ? 1 : -1);
    }
  }

  typeClass = () => {
    return this.typeFlight === 'C' ? `- (BC)` : '';
  }
}
