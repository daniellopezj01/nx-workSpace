import { EventEmitter, Injectable, Output, ViewChild } from '@angular/core';
import { RestService } from '../../../services/rest/rest.service';

@Injectable({
  providedIn: 'root',
})
export class FilterItemsService {
  @ViewChild('dropdown') dropdown: any;
  @Output() filterCb = new EventEmitter();
  public filterSelect: any = [];
  public listFilter: any = [];
  public queryConditional: any = [];
  public stepCondition: any = null;
  public secondData: any = {};
  public valueQry: any;
  public loading = false;
  public preCondition: any = {};
  public preSelect: any = {};

  constructor(private rest: RestService) {
    this.listFilter = [
      {
        label: 'FILTER.DEPOSIT',
        source: 'deposits',
        field: 'deposits',
        level: 'second',
        condition: false,
      },
      {
        label: 'FILTER.PROVIDERS',
        source: 'providers',
        field: 'providers',
        level: 'second',
        condition: false,
      },
      {
        label: 'FILTER.QTY',
        source: false,
        field: 'qty',
        level: 'first',
        condition: true,
      },
      // {
      //   label: "SKU",
      //   source: false,
      //   field: "sku",
      //   level: "first",
      //   condition: true
      // }
    ];

    this.queryConditional = [
      {
        name: 'Mayor de',
        value: '>',
        level: 'condition',
      },
      {
        name: 'Menor de',
        value: '<',
        level: 'condition',
      },
      {
        name: 'Igual',
        value: '=',
        level: 'condition',
      },
    ];
  }

  public loadFilter = (data: any) => {
    this.loading = false;
    const customHeader = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ignoreLoadingBar: '',
    };

    switch (data.level) {
      case 'first':
        this.preSelect = data;
        if (data.condition) {
          this.stepCondition = 'list';
        } else {
          this.selectFilter(data);
        }

        break;
      case 'second':
        this.preSelect = data;
        this.loading = true;
        this.rest
          .get(`${data.source}/all`, true, customHeader)
          .subscribe((res) => {
            this.loading = false;
            this.secondData = res;
          });
        break;
      default:
        break;
    }
  };

  public selectFilter = (data: any) => {
    if (data && data.level === 'condition') {
      this.valueQry = null;
      this.preCondition = data;
      this.stepCondition = 'input';
    } else {
      this.preCondition = null;
      this.valueQry = data;
      this.emitFilter();
    }
  };

  public selectFilterQry = () => {
    this.emitFilter();
  };

  public clear = () => {
    this.preSelect = {
      source: null,
      data: [],
    };
  };

  public removeValueSelect = (filterSelect = [], value: any) => {
    // console.log('filterSelect', filterSelect)
    // console.log('value', value)
    return filterSelect.filter((a) => {
      if (a !== value) {
        return a;
      }
    });
  };

  public emitFilter = () => {
    this.filterCb.emit({
      pre: this.preSelect,
      condition: this.preCondition,
      value: this.valueQry,
    });
    this.secondData = {};
    this.stepCondition = null;
  };
}
