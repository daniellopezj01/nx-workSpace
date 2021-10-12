import { EventEmitter, Injectable, Output } from '@angular/core';
import _ from 'lodash';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class HotelsService {
  @Output() srcTrigger = new EventEmitter<any>();
  @Output() loadData = new EventEmitter<any>();
  public page = 1;
  public limitPerPage = 15;
  public arrayParms = ['cityId', 'cityName', 'checkIn', 'checkOut', 'adultsCount', 'childrenCount']
  public readonly defaultParams: HotelParametersModel = {
    sortBy: 'popularity',
    cityId: 3683,
    cityName: 'Madrid',
    checkIn: moment().add(1, 'week').toDate(),
    checkOut: moment().add(2, 'week').toDate(),
    adultsCount: 1,
    currency: 'USD',
    childrenCount: 0,
    preLoadIds: [
      { cityName: 'Madrid', id: 3683 }, // 3683, 15542, 20456, 4442
      { cityName: 'New York', id: 20857 }, // 3683, 15542, 20456, 4442
      { cityName: 'París', id: 15542 }, // 3683, 15542, 20456, 4442
    ],
    limit: 70, // Change 300 to 100 because broken when much data
  };
  public rawData: any;
  public paginateDate?: any[][] = [];
  public nextPage?: boolean;

  // constructor() { }

  /**
   * Comenzando: La idea es simular all paginacion desde aqui de este servicio
   * agarramos la cantidad de resultados totales la dividimos en array que simulan las paginas
   */

  simulatePagination(data: any, override = true, paginate: any = undefined): any {
    if (override) {
      this.rawData = data;
    }
    const bundleSize = data?.length > this.limitPerPage;
    this.paginateDate = bundleSize ? _.chunk(data, this.limitPerPage) : [data];
    this.nextPage =
      paginate === undefined ? !!this.paginateDate?.length : paginate;
    const finalData = this.paginateDate[bundleSize ? this.page - 1 : 0];
    return finalData || [];
  }

  getNextPage(): any {
    if (this.nextPage) {
      this.page = this.page + 1;
      if (this.paginateDate) {
        const nextData = this.paginateDate[this.page - 1] || [];
        this.nextPage = !!nextData?.length;
        return nextData;
      } else {
        return null
      }
    } else {
      return [];
    }
  }
}

export class HotelParametersModel {
  sortBy?: string;
  cityId?: number;
  currency?: string;
  cityName?: string;
  checkIn?: Date;
  checkOut?: Date;
  adultsCount?: number;
  childrenCount?: number;
  preLoadIds?: Array<any>;
  limit?: number;
}
