/* tslint:disable:variable-name */
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import * as _ from 'lodash';
import { MainSearchService } from '../../../../main-search.service';
import { FlightsService } from '../../../services/flights.service';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss']
})
export class CardDetailsComponent implements OnInit {
  @Input() mainFlight: any;
  @Input() params: any;
  public flights: Array<any> = [];
  public loading = false;
  // public segments: SegmentModel;
  public loadingButton = false;
  public fullView: boolean = false;
  public activeButton: boolean = false

  constructor(
    public datePipe: DatePipe,
    private service: FlightsService,
    public mainSearchService: MainSearchService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
  }

  ngOnInit(): void {

  }

  goToFormPnr(): void {
    if (!this.activeButton) {
      this.activeButton = true
      this.service.beginWithPnr.emit(true);
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          const el = document.getElementById('formPnr');
          if (el) {
            window.scrollTo({ top: el.offsetTop - 30, behavior: 'smooth' });
            this.activeButton = false
          }
        }, 50);
      }
    }
  }
}

export class SegmentModel {
  flights: Array<any> = [];
  currencyExchange: any;
  stops: number = 0;
  currencyCurrent: string = '';
  searchId: string = '';
  firstFlight: any;
  lastFlight: any;
  simpleRoad: any;
}
