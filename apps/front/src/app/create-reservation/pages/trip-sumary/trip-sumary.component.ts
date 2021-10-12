import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-trip-sumary',
  templateUrl: './trip-sumary.component.html',
  styleUrls: ['./trip-sumary.component.scss'],
})
export class TripSumaryComponent implements OnInit {
  @Input() departure: any;
  @Input() tour: any;
  @Input() intention: any;
  public startLocation = '';
  public endLocation = '';
  dataBookUs = [
    {
      name: 'CREATE_RESERVATION.WHY_BOOK_WITH_US_ONE',
    },
    {
      name: 'CREATE_RESERVATION.WHY_BOOK_WITH_US_TWO',
    },
    {
      name: 'CREATE_RESERVATION.WHY_BOOK_WITH_US_THREE',
    },
    {
      name: 'CREATE_RESERVATION.WHY_BOOK_WITH_US_FOUR',
    },
  ];
  importantNotes = 'CREATE_RESERVATION.IMPORTANT_NOTES';


  ngOnInit(): void {
    this.laodLocations();
  }

  laodLocations() {
    const { itinerary } = this.tour;
    const head = _.head(itinerary);
    const last = _.last(itinerary);
    this.startLocation = this.getLocation(head);
    this.endLocation = this.getLocation(last);
  }

  getLocation = (object: any) => {
    const { city, country } = object.stringLocation;
    return `${city}-${country}`;
  }
}
