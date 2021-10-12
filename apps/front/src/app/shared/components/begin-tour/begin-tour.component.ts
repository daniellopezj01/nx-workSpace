import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-begin-tour',
  templateUrl: './begin-tour.component.html',
  styleUrls: ['./begin-tour.component.scss']
})
export class BeginTourComponent implements OnInit {
  @Input() tour: any;
  @Input() simple: boolean = false;
  public beginTour: any;

  constructor() { }

  ngOnInit(): void {
    const { itinerary } = this.tour;
    this.beginTour = _.head(itinerary);
  }

}
