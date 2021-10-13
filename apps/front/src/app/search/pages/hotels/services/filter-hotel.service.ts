/* eslint-disable no-case-declarations */
import { ModalsService } from './../../../../core/services/modals.service';
import {
  EventEmitter,
  Injectable,
  Input,
  OnDestroy,
} from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import * as _ from 'lodash';
import { HotelsService } from './hotels.service';

@Injectable({
  providedIn: 'root',
})
export class FilterHotelService {
  @Input() limit = {
    maxDistance: 10,
    maxPrice: 100,
  };
  public maxDistance?: number;
  activeClear?: boolean;
  filterData: any = [];
  currentPrice = 0;
  currentMinPrice = 0;
  currentMaxPrice = 0;
  optionsPrice: Options = {
    floor: 0,
    ceil: 10,
    minRange: 5,
    animate: false,
    pushRange: true,
  };
  currentDistance = 0;
  optionsDistance: Options = {
    floor: 0,
    ceil: 10,
    minRange: 0.1,
    animate: false,
  };

  currentMinRating = 0;
  currentMaxRating = 10;
  optionsRating: Options = {
    floor: 0,
    ceil: 10,
    animate: false,
  };

  changeLoading = new EventEmitter<any>();
  changeFilters = new EventEmitter<any>();
  changeCurrentFilters = new EventEmitter<any>();

  starsArray: Array<any> = [
    {
      active: false,
      stars: 5,
    },
    {
      active: false,
      stars: 4,
    },
    {
      active: false,
      stars: 3,
    },
    {
      active: false,
      stars: 2,
    },
    {
      active: false,
      stars: 1,
    },
    {
      active: false,
      stars: 0,
    },
  ];

  constructor(
    private hotelService: HotelsService,
    private modals: ModalsService
  ) {
    this.begin();
  }

  public get getlimit() {
    return this.limit;
  }

  public setData(data: any) {
    this.filterData = data;
  }

  public get getactiveClear() {
    return this.activeClear;
  }

  begin(data: any = {}) {
    this.filterData = data;
    this.loadOptionsPrice(data);
    this.loadOptionsDistance(data);
  }

  loadOptionsPrice(data: any) {
    data = this.hotelService.rawData;
    const maxPrice: any = _.maxBy(data, 'price');
    const minPrice: any = _.minBy(data, 'price');
    const newOptions: Options = Object.assign({}, this.optionsPrice);
    newOptions.floor = minPrice?.price || 0;
    newOptions.ceil = maxPrice?.price || 1000;
    this.optionsPrice = newOptions;
    this.currentMinPrice = minPrice?.price;
    this.currentMaxPrice = maxPrice?.price;
  }

  loadOptionsDistance(data: any) {
    const maxDistance: any = _.maxBy(data, 'distance');
    const minDistance: any = _.minBy(data, 'distance');
    const newOptions: Options = Object.assign({}, this.optionsDistance);
    newOptions.floor = minDistance?.distance || 0;
    newOptions.ceil = maxDistance?.distance || 15;
    this.optionsDistance = newOptions;
    this.currentDistance = maxDistance?.distance;
  }

  actionFilters(value: any, key: string) {
    this.filterData = this.filterData?.length
      ? this.filterData
      : this.hotelService.rawData;
    let tmpFilter;
    switch (key) {
      case 'stars':
        const index = _.findIndex(this.starsArray, { stars: value });
        this.starsArray[index].active = !this.starsArray[index].active;
        const activeStarts = _.map(
          _.filter(this.starsArray, { active: true }),
          'stars'
        )
        tmpFilter = _.filter(this.hotelService.rawData, (b) =>
          activeStarts?.length ? activeStarts.includes(b.stars) : true
        );
        break;
      case 'price':
        const min: number = _.head(value) || 0
        const max: number = _.last(value) || 0
        tmpFilter = _.filter(this.hotelService.rawData, (a) =>
          _.inRange(a.price, min - 1, max + 1)
        );
        break;
      case 'distance':
        tmpFilter = _.filter(this.hotelService.rawData, (a) =>
          _.inRange(a.distance, 0, this.currentDistance)
        );
        break;
    }
    this.changeCurrentFilters.emit({ data: tmpFilter, key });
  }

  public closeModal() {
    this.modals.close();
  }

  clearFilters() {
    this.activeClear = false;
    _.map(this.starsArray, (a) => {
      a.active = false;
    });
    this.currentMinPrice = 0;
    this.currentMinRating = 0;
    this.currentDistance = this.limit.maxDistance;
    this.currentMaxRating = 10;
    this.currentMaxPrice = this.limit.maxPrice;
    this.changeFilters.emit(this.filterData);
  }
}
