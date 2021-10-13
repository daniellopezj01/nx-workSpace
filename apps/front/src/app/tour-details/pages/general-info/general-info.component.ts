import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {
  @Input() tour: any;

  public defaultTransport = '';
  public beginTour: any;

  ngOnInit(): void {
    const { itinerary } = this.tour;
    this.beginTour = _.head(itinerary);
  }

  transport = () => {
    let str = '';
    if (this.tour.transport.length) {
      _.map(this.tour.transport, (a) => {
        str += `${a.name}/`;
      });
      return str.slice(0, -1);
    } else {
      return this.defaultTransport;
    }
  }

}
