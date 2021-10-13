import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../reservation.service';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent implements OnInit {

  tour: any;
  departure: any;
  loading = false;
  codeReservation: any;
  public beginTour: any;

  constructor(private service: ReservationService, private activeRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.codeReservation = this.activeRouter.snapshot?.parent?.params.id;
    this.service.setCode(this.codeReservation);
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    const data = await this.service.getData();
    const { departure, tour } = data;
    this.tour = tour;
    const { itinerary, } = this.tour;
    this.beginTour = _.head(itinerary);
    this.departure = departure;
    this.loading = false;
  }

}
