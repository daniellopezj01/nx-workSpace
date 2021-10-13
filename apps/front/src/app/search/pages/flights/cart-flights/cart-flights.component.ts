import { ModalsService } from './../../../../core/services/modals.service';
import { RestService } from './../../../../core/services/rest.service';
import { FlightsService } from './../services/flights.service';
import { DatePipe } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import * as _ from 'lodash';
import { MainSearchService } from '../../main-search.service';
import { Router } from '@angular/router';
import { ErrorHandlingComponent } from '../error-handling/error-handling.component';

@Component({
  selector: 'app-cart-flights',
  templateUrl: './cart-flights.component.html',
  styleUrls: ['./cart-flights.component.scss'],
})
export class CartFlightsComponent implements OnInit {
  html = ``;
  @Input() mainFlight: any;
  @Input() adults: any;
  @Input() children: any;
  @Input() fromToArrive: any;
  // tslint:disable-next-line:variable-name
  public flights: Array<any> = [];
  public loading = false;
  public segments?: Array<SegmentModel> = [];
  public loadingButton = false;
  public fullView = false;

  constructor(
    public datePipe: DatePipe,
    private rest: RestService,
    private service: FlightsService,
    private route: Router,
    public mainSearchService: MainSearchService,
    private modalService: ModalsService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnInit(): void {
    const { H } = this.mainSearchService.getParamsKey();
    this.mainSearchService.currencySymbol = H;
    this.transformObject()
  }

  transformObject() {
    const { schedules } = this.mainFlight
    const firstFlight: any = _.head(this.fromToArrive)
    const index = 1 + _.findIndex(schedules,
      (i: any) => i?.arrival?.airport === firstFlight?.destination || i?.arrival?.city === firstFlight?.destination)
    this.mainFlight.outboundFlight = _.slice(schedules, 0, index)
    this.mainFlight.returnFlight = _.slice(schedules, index, schedules.length)
  }

  validateSearch(): void {
    this.loadingButton = true
    const params = this.service.globalParamsRequest
    const { outboundFlight, returnFlight } = this.mainFlight
    params.schedules = [outboundFlight, returnFlight]
    params.codeItinerary = this.mainFlight.id
    params.segments = this.mainFlight.segments
    params.children = this.children
    params.adults = this.adults
    this.loadingButton = false
    this.rest.post('plugins/sabre/events/validateSearch', { params }, false).subscribe(res => {
      const { code } = res
      this.route.navigate(['search', 'flights', 'details', code])
      this.loadingButton = false
    },
      err => {
        this.openError()
        this.loadingButton = false
        console.log(err)
      })
  }

  getSegment = (value: any) => {
    if (this.fromToArrive) {
      return this.fromToArrive[value]
    }
  }

  openError() {
    const data = { errorTitle: 'VALIDATE_TITLE', errorDescription: 'VALIDATE_DESCRIPTION', };
    this.modalService.openComponent(
      data,
      ErrorHandlingComponent,
      'modal-md w-100',
      true
    );
  }

}

export class SegmentModel {
  flights?: Array<any>;
  currencyExchange: any;
  stops?: number;
  currencyCurrent?: string;
  searchId?: string;
  firstFlight: any;
  lastFlight: any;
  simpleRoad: any;
}
