import { ModalsService } from './../../../../core/services/modals.service';
import { RestService } from './../../../../core/services/rest.service';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterHotelComponent } from '../filter-hotel/filter-hotel.component';
import * as _ from 'lodash';
import { debounceTime } from 'rxjs/operators';

import { MainSearchService } from '../../main-search.service';
import { HotelsService } from '../services/hotels.service';
import { FilterHotelService } from '../services/filter-hotel.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-container-hotel',
  templateUrl: './container-hotel.component.html',
  styleUrls: ['./container-hotel.component.scss'],
})
export class ContainerHotelComponent
  implements OnInit, OnDestroy, AfterContentChecked {
  public listSubscribers: any = [];
  public params: any;
  public loading?: boolean;
  public data: Array<any> = [];
  public loadingFilters = false;
  public limitFilters: any = {
    maxPrice: 0,
    maxDistance: 0,
  };

  constructor(
    private rest: RestService,
    public hotelService: HotelsService,
    private route: ActivatedRoute,
    private mainSearchService: MainSearchService,
    private modalService: ModalsService,
    private hotelFilters: FilterHotelService,
    private cdRef: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<any> {
    this.getDataFirstTime()
    this.listObserver();
  }

  listObserver = () => {
    const observer1$ = this.hotelFilters.changeFilters.subscribe((result) => { //filtros del buscador principal, 
      this.getDataFirstTime()
    });
    const observer2$ = this.hotelFilters.changeCurrentFilters.subscribe((result) => { //filtros del buscador principal, 
      const { data } = result;
      this.hotelService.page = 1
      const dataNew = data;
      const parseData = this.hotelService.simulatePagination(dataNew, false, true);
      this.data = [...parseData];
    });
    const observer3$ = this.hotelService.loadData.pipe(debounceTime(100)).subscribe((res) => {
      console.log('holaaa entre a loadData en hoteles')
      const queryParam = this.mainSearchService.getParamsKey();
      const { C, D, E, F, H } = queryParam;
      const dates = D.split('__');
      this.params.checkIn = _.head(dates) || this.params.checkIn;
      this.params.checkOut = _.last(dates) || this.params.checkOut;
      this.params.currency = H || this.params.currency;
      /**
       * C: ID city
       * E: Adults number
       * F: Children number
       */
      this.requestData();
    });

    this.listSubscribers = [observer1$, observer2$, observer3$];
  }
  ngOnDestroy() {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }


  getDataFirstTime() {
    const defaultParams = this.hotelService.defaultParams
    const globalParams = this.mainSearchService.getParamsKey()
    const paramsFromUrl = _.pick(globalParams, this.hotelService.arrayParms)
    this.params = { ...defaultParams, ...paramsFromUrl }
    // this.currentParams = this.mainSearchService.paramsToUrl()
    this.requestData()
  }

  requestData() {
    this.loading = true;
    this.rest.post('plugins/travelpayouts-api-hotels/events/get_hotels_v2', { params: this.params })
      .subscribe(
        (res) => {
          const { result } = res;
          this.loading = false;
          if (result) {
            this.data = this.hotelService.simulatePagination(result);
            this.hotelFilters.begin(this.data);
          }
        },
        (err) => {
          this.loading = err;
        }
      );
  }

  moreData() {
    const nextData = this.hotelService.getNextPage();
    this.data = [...this.data, ...nextData];
  }

  openFilters() {
    this.modalService.openComponent(
      {},
      FilterHotelComponent,
      'modal-filters-hotel'
    );
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }
}
