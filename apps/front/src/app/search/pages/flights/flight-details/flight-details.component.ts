import { RestService } from './../../../../core/services/rest.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.scss']
})
export class FlightDetailsComponent implements OnInit {
  public code?: string
  public data: any
  public params: any
  public loading?: boolean = false
  public numberAdults?: number;
  public numberchildrens?: number;

  constructor(
    private active: ActivatedRoute,
    private rest: RestService
  ) { }

  ngOnInit(): void {
    this.code = this.active.snapshot.params.code;
    this.loading = true;
    this.rest.get(`validateFlights/${this.code}`).subscribe(res => {
      const { data, params, code, adults, childrens } = res
      this.data = data
      this.loading = false;
      this.params = params?.OTA_AirLowFareSearchRQ?.OriginDestinationInformation
      this.code = code
      this.numberAdults = adults
      this.numberchildrens = childrens
    }, err => {
      this.loading = false;
      console.log(err)
    })
  }

}
