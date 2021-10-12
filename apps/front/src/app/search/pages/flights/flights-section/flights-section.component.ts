import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-flights-section',
  templateUrl: './flights-section.component.html',
  styleUrls: ['./flights-section.component.scss']
})
export class FlightsSectionComponent implements OnInit {
  @Input() mainFlight: any;
  @Input() params: any;
  public fullView = false


  ngOnInit(): void {
    this.transformObject()
  }

  getSegment = (value: any) => this.params[value]

  transformObject() {
    const { schedules } = this.mainFlight
    const firstFlight: any = _.head(this.params)
    const placeDestination = firstFlight?.DestinationLocation?.LocationCode
    const index = 1 + _.findIndex(schedules,
      (i: any) => i?.arrival?.airport === placeDestination || i?.arrival?.city === placeDestination)
    this.mainFlight.outboundFlight = _.slice(schedules, 0, index)
    this.mainFlight.returnFlight = _.slice(schedules, index, schedules.length)
  }
}
