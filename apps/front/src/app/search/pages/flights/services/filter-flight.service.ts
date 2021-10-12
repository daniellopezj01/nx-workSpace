/* eslint-disable no-case-declarations */
import { ModalsService } from './../../../../core/services/modals.service';
import { EventEmitter, Injectable, Input } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import * as _ from 'lodash';
import { MainSearchService } from '../../main-search.service';
import { FlightsService } from './flights.service';

@Injectable({
  providedIn: 'root',
})
export class FilterFlightService {
  @Input() limit = {
    maxDuration: 10,
    maxPrice: 100,
    maxStops: [],
  };

  public changeLoading = new EventEmitter<any>();
  public changeFilters = new EventEmitter<any>();
  public changeCurrentFilters = new EventEmitter<any>();

  public filterData: any;
  public activeClear?: boolean;
  public timeObject: any = [
    {
      active: false,
      type: 'mañana',
    },
    {
      active: false,
      type: 'tarde',
    },
  ];
  /***PRICE */
  public currentPrice = 0;
  public currentMinPrice = 0;
  public currentMaxPrice = 0;
  public optionsPrice: Options = {
    floor: 0,
    ceil: 10,
    minRange: 5,
    animate: false,
    pushRange: true,
  };
  public stopsArray: Array<any> = [];

  public minDuration = 0;
  public maxDuration = 0;
  public optionsDuration: Options = {
    floor: 0,
    ceil: 10,
  };
  public activeTime?: boolean;

  constructor(
    private modals: ModalsService,
    private flightService: FlightsService,
    private mainSearchService: MainSearchService
  ) { }

  public get getlimit() {
    return this.limit;
  }

  public get getactiveClear() {
    return this.activeClear;
  }

  public setData(data: any) {
    this.filterData = data;
  }

  public checkActiveTime() {
    this.activeTime = this.timeObject[0].active !== this.timeObject[1].active;
  }

  begin(data: any = {}) {
    this.filterData = data;
    this.loadOptionsPrice(data);
    this.loadOptionsDuration(data);
    this.loadOptionsScales(data);
  }

  loadOptionsPrice(data: any) {
    data = this.flightService.rawData;
    const maxPrice: any = _.maxBy(data, 'price.totalPrice');
    const minPrice: any = _.minBy(data, 'price.totalPrice');
    const newOptions: Options = Object.assign({}, this.optionsPrice);
    newOptions.floor = minPrice?.price?.totalPrice || 0;
    newOptions.ceil = maxPrice?.price?.totalPrice || 100;
    this.optionsPrice = newOptions;
    this.currentMaxPrice = maxPrice?.price?.totalPrice;
    this.currentMinPrice = minPrice?.price?.totalPrice;
  }

  loadOptionsDuration(data: any) {
    data = this.flightService.rawData;
    const scheduleMaxDuration: any = _.maxBy(data, 'schedules[0].elapsedTime');
    const scheduleMinDuration: any = _.minBy(data, 'schedules[0].elapsedTime');
    const newOptions: Options = Object.assign({}, this.optionsDuration);
    const maxTime = scheduleMaxDuration.schedules[0].elapsedTime
    const minTime = scheduleMinDuration.schedules[0].elapsedTime
    newOptions.ceil = maxTime || 100;
    newOptions.floor = minTime;
    this.optionsDuration = newOptions;
    this.maxDuration = maxTime;
    this.minDuration = minTime;
  }

  loadOptionsScales(data: any) {
    data = this.flightService.rawData;
    this.stopsArray = []
    const steps = _.uniqBy(data, (i: any) => i.schedules.length)
    _.map(steps, o => {
      this.stopsArray.push({
        active: false,
        stops: o.schedules.length - 2
      })
    })
    this.stopsArray = _.orderBy(this.stopsArray, ['stops'], ['desc'])
  }

  clearFilters() {
    console.log('clear filters')
  }

  actionFilters(value: any, key: string) {
    this.filterData = this.filterData?.length
      ? this.filterData
      : this.flightService.rawData;
    let tmpFilter;
    switch (key) {
      case 'stops':
        const index = _.findIndex(this.stopsArray, { stops: value });
        this.stopsArray[index].active = !this.stopsArray[index].active;
        const activeStops = _.map(
          _.filter(this.stopsArray, { active: true }),
          'stops'
        )
        if (activeStops.length > 0) {
          tmpFilter = _.filter(this.flightService.rawData, (b) => {
            const stops = b.schedules?.length - 2
            return activeStops.includes(stops)
          });
        } else {
          tmpFilter = this.flightService.rawData
        }
        break;
      case 'price':
        // variable value has the value =  [ min, max]
        const min: number = _.head(value) || 0;
        const maxi: number = _.last(value) || 0;
        tmpFilter = _.filter(this.flightService.rawData, (a) =>
          _.inRange(a.price?.totalPrice, min - 1, maxi + 1)
        );
        break;
      case 'duration': // total_duration
        const max: number = value;
        tmpFilter = _.filter(this.flightService.rawData, a => _.inRange(a.schedules[0].elapsedTime, 0, max + 1));
        break;
    }
    this.changeCurrentFilters.emit({ data: tmpFilter, key });
  }

  public closeModal() {
    this.modals.close();
  }

  transFormTime(time: any) {
    const hour = time.split(':');
    return hour[0] > 12 ? `${hour[0] - 12}:${hour[1]} p. m.` : `${time} a. m.`;
  }
}
