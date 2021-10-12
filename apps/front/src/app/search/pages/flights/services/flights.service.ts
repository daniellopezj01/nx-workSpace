import { EventEmitter, Injectable, Output } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  @Output() loadData = new EventEmitter<any>();
  @Output() beginWithPnr = new EventEmitter<any>();
  public keyInFilters = 'Flights';
  // tslint:disable-next-line:variable-name
  public search_id = '';
  public params: any = {};
  public rawData: any;
  public paginateDate?: any[][];
  public nextPage?: boolean;
  public page = 1;
  public limitPerPage = 15;
  public globalParamsRequest: any
  public arrayParms = ['origin', 'destination', 'checkIn', 'checkOut', 'adultsCount', 'childrenCount']

  public readonly defaultParams: FlightsParametersModel = {
    // currency: 'USD',
    checkIn: moment().add(10, 'week').toDate(),
    checkOut: moment().add(12, 'week').toDate(),
    // limit: 600,
    adultsCount: 1,
    childrenCount: 0,
    segments: [
      {
        origin: 'MAD',
        destination: 'PAR',
        date: '2020-12-10',
      },
      {
        origin: 'PAR',
        destination: 'MAD',
        date: '2020-12-17',
      },
    ],
  };

  public readonly preLoadIds = [
    {
      from: {
        name: 'Madrid',
        code: 'MAD',
      },
      to: {
        name: 'París',
        code: 'PAR',
      },
    },
  ];

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
      }
      return null
    } else {
      return [];
    }
  }
}

export class FlightsParametersModel {
  // currency: string;
  // tslint:disable-next-line:variable-name
  checkIn?: Date;
  checkOut?: Date;
  adultsCount?: number = 0;
  childrenCount?: number;
  segments?: Array<any>;
  // limit: number;
}
