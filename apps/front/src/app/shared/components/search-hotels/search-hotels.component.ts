import { FilterHotelService } from './../../../search/pages/hotels/services/filter-hotel.service';
import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  faMapMarkerAlt,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import _ from 'lodash';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MainSearchService } from '../../../search/pages/main-search.service';
import { HotelsService } from '../../../search/pages/hotels/services/hotels.service';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-search-hotels',
  templateUrl: './search-hotels.component.html',
  styleUrls: ['./search-hotels.component.scss'],
})
export class SearchHotelsComponent implements OnInit, OnDestroy {
  @ViewChild('inputDates') private inputDates: any;
  @Input() fromHome = false;
  public faMinus = faMinus;
  public faPlus = faPlus;
  public loadingSearch = false;
  public globalParams: any;
  public formSearch: FormGroup;
  public today = new Date();
  public focusSearch = false;
  public focusPerson = false;
  public searchValue = '';
  public dataPlaces: any;
  public dataPlaces$: Observable<any> | undefined;
  public minLetterSearch = 1;

  public loadingPlaces = false;
  public notFound = false;
  public request: any;
  public chadArray: Array<any> = [];
  public adultsCount = 1;
  public childrenCount = 0;
  public cityId: any = 0;
  public bsRangeValue: any;
  public listSubscribers: any = [];
  public currentParams: any = {}

  public bsOptions = {
    showWeekNumbers: false,
    isAnimated: false,
    rangeInputFormat: 'DD-MMM-YYYY',
    maxDateRange: 29,
  };

  constructor(
    private library: FaIconLibrary,
    private formBuilder: FormBuilder,
    private router: Router,
    private hotelService: HotelsService,
    private filterService: FilterHotelService,
    private datePipe: DatePipe,
    private rest: RestService,
    private route: ActivatedRoute,
    private mainSearchService: MainSearchService
  ) {
    library.addIcons(faMapMarkerAlt);
    this.formSearch = this.formBuilder.group({
      search: ['', Validators.required],
      dates: ['', Validators.required],
      people: [''],
    });
  }

  ngOnInit() {

    if (!this.fromHome) {
      this.listObserver();
    }
  }

  listObserver = () => {
    const {
      checkIn,
      checkOut,
    } = this.hotelService.defaultParams;
    this.bsRangeValue = [moment(checkIn).toDate(), moment(checkOut).toDate()];
    this.route.queryParams.subscribe(() => {
      const defaultParams = this.hotelService.defaultParams
      const paramsFromUrl = _.pick(this.mainSearchService.getGlobalParams, this.hotelService.arrayParms)
      this.currentParams = { ...defaultParams, ...paramsFromUrl }
      const { cityName, checkIn, checkOut, adultsCount, childrenCount } = this.currentParams;
      this.searchValue = cityName;
      this.adultsCount = adultsCount;
      this.childrenCount = childrenCount;
      this.bsRangeValue = [moment(checkIn, 'YYYY-MM-DD').toDate(), moment(checkOut, 'YYYY-MM-DD').toDate()];
    });
  }

  getPlaces(event: any) {
    const body = { params: { lang: 'es', query: this.searchValue, limit: 6 } };
    if (this.searchValue.length) {
      this.dataPlaces$ = this.rest
        .post(`plugins/travelpayouts-api-hotels/events/search_place`, body)
        .pipe(tap((a) => (this.dataPlaces = a)));
    }
  }

  onFocus() {
    this.focusSearch = true;
  }

  onBlur() {
    this.focusSearch = false;
  }

  selectedPlace(place: any) {
    this.searchValue = place?.cityName.toUpperCase();
    this.cityId = place?.id;
  }

  search(): any {
    const { cityId, cityName } = this.currentParams
    const checkIn = moment(this.bsRangeValue[0]).format('YYYY-MM-DD').toString()
    const checkOut = moment(this.bsRangeValue[1]).format('YYYY-MM-DD').toString()
    const properties = {
      cityId: this.cityId || cityId,
      cityName: this.searchValue || cityName,
      checkIn,
      checkOut,
      adultsCount: this.adultsCount,
      childrenCount: this.childrenCount
    }
    if (this.fromHome) {
      const globalParams = this.mainSearchService.getGlobalParams
      this.router.navigate([`/search/hotels`], {
        queryParams: { ...globalParams, ...properties },
      });
    } else {
      this.mainSearchService.setParams(properties, this.filterService);
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

  ngOnDestroy() {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }
}
