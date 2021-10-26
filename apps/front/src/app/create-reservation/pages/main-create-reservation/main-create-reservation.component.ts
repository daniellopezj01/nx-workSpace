import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';

import { DeviceDetectorService } from 'ngx-device-detector';
import { ModalsService } from '../../../core/services/modals.service';
import { RestService } from '../../../core/services/rest.service';
import { MainModalMapItineraryComponent } from '../../../shared/components/map-itinerary-global/main-modal-map-itinerary/main-modal-map-itinerary.component';

@Component({
  selector: 'app-main-create-reservation',
  templateUrl: './main-create-reservation.component.html',
  styleUrls: ['./main-create-reservation.component.scss'],
})
export class MainCreateReservationComponent implements OnInit {
  departure: any;
  tour: any;
  intention: any;
  loading = false;

  constructor(
    private active: ActivatedRoute,
    private modalService: ModalsService,
    private rest: RestService,
    public datePipe: DatePipe,
    public deviceDetector: DeviceDetectorService
  ) {
    deviceDetector.isDesktop()
  }

  ngOnInit(): void {
    const slug = this.active.snapshot.params.slug;
    const idIntention = this.active.snapshot.params.idIntention;
    this.loadData(slug, idIntention);
  }

  loadData = (slug: string, idIntention: any) => {
    this.loading = true;
    this.rest
      .get(`tours/reservation/${slug}/${idIntention}`)
      .subscribe((res: any) => {
        const { intention, tour, departure } = res;
        this.tour = tour;
        this.departure = departure;
        this.intention = intention;
        this.definedNights();
        this.loading = false;
      });
  }

  definedNights() {
    const array = _.split(this.tour.duration, ' ') || ([1] as any);
    // tslint:disable-next-line:radix
    this.tour.nights = _.head(_.filter(array, (i) => _.isNumber(parseInt(i))));
  }

  createDate(date: any) {
    const arrayDate = date.split('-');
    const newDate = `${arrayDate[1]}-${arrayDate[0]}-${arrayDate[2]}`;
    return this.datePipe.transform(newDate);
  }

  openModal() {
    const data = { tour: this.tour };
    this.modalService.openComponent(
      data,
      MainModalMapItineraryComponent,
      'modal-lg w-100'
    );
  }
}
