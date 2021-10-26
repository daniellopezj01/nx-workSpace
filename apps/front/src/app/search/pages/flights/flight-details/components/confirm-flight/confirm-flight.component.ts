import { RestService } from './../../../../../../core/services/rest.service';
import { FlightDetailsService } from './../../flight-details.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash'

@Component({
  selector: 'app-confirm-flight',
  templateUrl: './confirm-flight.component.html',
  styleUrls: ['./confirm-flight.component.scss']
})

export class ConfirmFlightComponent implements OnInit {
  public code?: string
  public data: any
  public params: any
  public loading = false
  public numberAdults = 0;
  public numberchildrens?: number;
  public passengers?: any;
  public loadingButton = false;

  constructor(
    private active: ActivatedRoute,
    private rest: RestService,
    private detailsService: FlightDetailsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.code = this.active.snapshot.params.code;
    if (this.detailsService.getInfoFlight) {
      this.destructureData(this.detailsService.getInfoFlight)
    } else {
      this.rest.get(`validateFlights/${this.code}`).subscribe(res => {
        this.destructureData(res)
      }, err => {
        this.loading = false;
        console.log(err)
      })
    }
  }

  destructureData(infoRequest: any) {
    const { data, params, code, adults, childrens, passengers } = infoRequest
    this.data = _.head(data)
    this.passengers = passengers
    this.params = params?.OTA_AirLowFareSearchRQ?.OriginDestinationInformation
    this.code = code
    this.numberAdults = adults
    this.numberchildrens = childrens
    this.loading = false
  }

  generatePnr() {
    this.loadingButton = true
    const params = { code: this.code }
    this.rest.post('plugins/sabre/events/createOrderPnr', { params }).subscribe(
      (res: any) => {
        console.log(res)
        this.loadingButton = false
        this.router.navigate(['payment', 'flights', this.code])
      },
      (err) => {
        console.log(err)
      })
  }
}
