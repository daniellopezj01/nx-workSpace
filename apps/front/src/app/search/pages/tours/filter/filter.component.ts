import { SharedService } from './../../../../core/services/shared.service';
import { RestService } from './../../../../core/services/rest.service';
import { Subscription } from 'rxjs';
import { ToursService } from './../services/tours.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ChangeDetectorRef, Inject, Input, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash';
import moment from 'moment';
import { isPlatformBrowser } from '@angular/common';
import { MainSearchService } from '../../main-search.service';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})

export class FilterComponent implements OnInit, OnDestroy {
  @Input() small = true;
  @Input() tripsNumber = 0;

  isBrowser: any;
  public routeContinents = '../../../../../assets/insearch/'
  public loading?: boolean = true;
  public ngSelectAge: any;
  public ngSelectCategory: any = 'empty';
  public ngSelectLanguages: any = 'empty';
  public listSubscribers: any = [];
  public today = new Date();
  public bsRangeValue?: any = undefined;
  public bsOptions = {
    showWeekNumbers: false,
    isAnimated: false,
    rangeInputFormat: 'DD-MMM-YYYY',
  };
  public prices: Array<priceModel> = [
    {
      name: 'Todos' as string,
      value: 'empty',
      min: null,
      max: null,
    },
    {
      name: 'menos 1000' as string,
      value: '0',
      min: 0,
      max: 999,
    },
    {
      name: '1000 a 3000' as string,
      value: '1',
      min: 1000,
      max: 3000,
    },
    {
      name: '3000 a 5000' as string,
      value: '2',
      min: 3000,
      max: 5000,
    },
    {
      name: 'mas de 5000' as string,
      value: '3',
      min: 5000,
      max: 100000,
    },
  ];
  public languages: any = [
    {
      key: "ES",
      text: 'GENERAL.SPANISH'
    },
    {
      key: "EN",
      text: 'GENERAL.ENGLISH'
    }
  ]
  public offeredBy: any = [
    {
      key: "mochileros",
      text: 'SEARCH.TOURS.MOCHILEROS'
    },
    {
      key: "agencies",
      text: 'SEARCH.TOURS.AGENCIES'
    }
  ]
  public itemsDuration: Array<durationModel> = [
    {
      min: 0,
      max: 7,
      name: 'SEARCH.TOURS.FILTER_DURATION_TO_7',
    },
    {
      min: 8,
      max: 14,
      name: 'SEARCH.TOURS.FILTER_DURATION_TO_14',
    },
    {
      min: 15,
      max: 21,
      name: 'SEARCH.TOURS.FILTER_DURATION_TO_21',
    },
    {
      min: 21,
      max: 1000,
      name: 'SEARCH.TOURS.FILTER_DURATION_MORE_THAN',
    },
  ];
  public itemsAge = [
    {
      min: 18,
      max: 35,
      name: '18 a 35 años',
    },
    {
      min: 18,
      max: 39,
      name: '18 a 39 años',
    },
    {
      min: 35,
      max: 49,
      name: '35 a 49 años',
    },
  ];
  currentMinPrice = 0;
  highLimitPrice = 6000
  currentMaxPrice = this.highLimitPrice;
  optionsPrice: Options = {
    floor: 0,
    ceil: this.highLimitPrice,
    minRange: 500,
    step: 5,
    animate: false,
    pushRange: true,
  };
  highLimitAge = 60
  lessLimitAge = 18
  currentMinAge = this.lessLimitAge;
  currentMaxAge = this.highLimitAge;
  optionsAge: Options = {
    floor: this.lessLimitAge,
    ceil: this.highLimitAge,
    minRange: 10,
    step: 2,
    animate: false,
    pushRange: true,
  };
  public continents: any = [];
  public categories: any = [];

  constructor(
    public tourService: ToursService,
    public translate: TranslateService,
    private mainSearchService: MainSearchService,
    private rest: RestService,
    private shared: SharedService,
    public device: DeviceDetectorService,
    private cdref: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
    }
  }

  ngOnInit(): void {
    this.loading = true
    this.tourService.sharedNumberTotalDocs.subscribe((res) => {
      this.tripsNumber = res
    })
    const observerOne$ = this.shared.dataTourFilters.subscribe((res) => {
      this.setValueInFiltersFromUrl()
      const { continents, categories } = res
      this.continents = continents
      this.categories = categories
      this.loading = false
    });
    this.shared.getFilters()
    this.listSubscribers = [observerOne$];
  }

  public get currentParams() {
    return this.mainSearchService.getGlobalParams
  }

  public closeModal() {
    this.tourService.closeModal();
  }

  /** filters */
  filterDuration({ min, max }: any) {
    this.updateParams({ minDuration: min, maxDuration: max })
  }

  filterAge({ value, highValue }: any) {
    // this.updateParams({ minAge: min, maxAge: max })
    this.updateParams({ minAge: value, maxAge: highValue })
  }

  filterContinent({ code }: any) {
    this.updateParams({ continent: code })
  }

  filterCategory({ slug }: any) {
    this.updateParams({ category: slug })
  }

  filterDates(rangeDate: any) {
    if (rangeDate) {
      const minDate = moment(this.bsRangeValue[0]).format('DD-MM-YYYY').toString()
      const maxDate = moment(this.bsRangeValue[1]).format('DD-MM-YYYY').toString()
      this.updateParams({ minDate, maxDate })
    }
  }

  filterLanguage({ key }: any) {
    this.updateParams({ language: key })
  }
  filterOfferedBy({ key }: any) {
    this.updateParams({ offeredBy: key })
  }

  filterPrice({ value, highValue }: any) {
    this.updateParams({ minPrice: value, maxPrice: highValue })
  }

  /**Active filters */
  checkActiveFilter(properties: any) {
    properties = properties.split(',')
    return properties.find((prop: any) => prop in this.currentParams)
  }

  valueActive(key = '', value: any = undefined) {
    const { maxDuration, language, maxDate, minDate, continent, offeredBy } = this.currentParams
    if (key === 'duration' && maxDuration) {
      return parseInt(maxDuration) === value?.max
    }
    if (key === 'language' && language) {
      return language === value.key
    }
    if (key === 'offeredBy' && offeredBy) {
      return offeredBy === value.key
    }
    if (key === 'dates' && maxDate && minDate) {
      return true
    }
    if (key === 'continent' && continent) {
      return continent === value.code
    }
    return null
  }

  setValueInFiltersFromUrl() {
    const { minPrice, maxPrice, category, minAge, maxAge, minDate, maxDate } = this.currentParams
    if (minPrice || maxPrice) {
      this.currentMinPrice = minPrice;
      this.currentMaxPrice = maxPrice;
    }
    if (category) {
      const currentCategory = _.find(this.categories, i => i.slug === category)
      this.ngSelectCategory = currentCategory._id
    }
    if (minAge && maxAge) {
      // this.ngSelectAge = _.find(this.itemsAge, i => i.max === parseFloat(maxAge) && i.min === parseFloat(minAge))
      this.currentMinAge = minAge;
      this.currentMaxAge = maxAge;
    }
    if (minDate && maxDate) {
      this.bsRangeValue = [moment(minDate, 'DD-MM-YYYY').toDate(), moment(maxDate, 'DD-MM-YYYY').toDate()];
    }
  }

  clearFilters() {
    this.mainSearchService.removeParms(this.tourService.arrayParms, this.tourService)
  }

  checkAllParamsActive() {
    return this.tourService.arrayParms.find((prop: any) => prop in this.currentParams)
  }

  closeFilters() {
    this.closeModal();
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 500);
    }
  }

  removeFilter(properties: any) {
    properties = properties.split(',')
    if (['minPrice', 'maxPrice'].find((prop) => prop in this.currentParams)) {
      this.currentMinPrice = 0;
      this.currentMaxPrice = this.highLimitPrice;
    }
    if (['category'].find((prop) => prop in this.currentParams)) {
      this.ngSelectCategory = null;
    }
    if (['minAge', 'maxAge'].find((prop) => prop in this.currentParams)) {
      // this.ngSelectAge = null;
      this.currentMinAge = this.lessLimitAge;
      this.currentMaxAge = this.highLimitAge;
    }
    if (['minDate', 'maxDate'].find((prop) => prop in this.currentParams)) {
      this.bsRangeValue = undefined;
    }
    this.mainSearchService.removeParms(properties, this.tourService)
  }

  updateParams(object: any) {
    this.mainSearchService.setParams(object, this.tourService)
  }

  ngOnDestroy() {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }
}

export class priceModel {
  name: string = '' as string;
  value: string = '' as string;
  min: any;
  max?: any
}

export class durationModel {
  name: string = '' as string;
  min: any;
  max?: any
}
