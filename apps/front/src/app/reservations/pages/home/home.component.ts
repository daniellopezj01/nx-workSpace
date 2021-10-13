import { ReservationService } from '../../reservation.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalsService } from '../../../core/services/modals.service';
import { MainModalMapItineraryComponent } from '../../../shared/components/map-itinerary-global/main-modal-map-itinerary/main-modal-map-itinerary.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  cards = [
    {
      id: 0,
      title: 'RESERVATION.TITLE_TRAVELER_INFO',
      description: 'RESERVATION.DESC_TRAVELER_INFO',
      icon: 'user/logo-personal-info.svg',
      route: 'personal',
      status: ['progress', 'completed'],
    },
    {
      id: 1,
      title: 'RESERVATION.TITLE_PAYMENT',
      description: 'RESERVATION.DESC_PAYMENT',
      icon: 'reservations/payment-logo.svg',
      route: 'transactions',
      status: ['progress', 'completed', 'pending'],
    },
    {
      id: 1,
      title: 'RESERVATION.TITLE_TOUR',
      description: 'RESERVATION.DESC_TOUR',
      icon: 'reservations/itinerary-logo.svg',
      route: 'tour',
      status: ['pending', 'progress', 'completed'],
    },
    {
      id: 0,
      title: 'RESERVATION.TITLE_EMERGENCY',
      description: 'RESERVATION.DESC_EMERGENCY',
      icon: 'reservations/emergency-logo.svg',
      route: 'emergency',
      status: ['progress', 'completed'],
    },
    {
      id: 0,
      title: 'RESERVATION.TITLE_BUYER_INFO',
      description: 'RESERVATION.DESC_BUYER_INFO',
      icon: 'reservations/buyer-logo.svg',
      route: 'buyer',
      status: ['progress', 'completed'],
    },
    {
      id: 0,
      title: 'RESERVATION.TITLE_SUPPORT',
      description: 'RESERVATION.DESC_SUPPORT',
      icon: 'reservations/support.svg',
      route: 'support',
      status: ['progress', 'completed'],
    },
    {
      id: 0,
      title: 'RESERVATION.TITLE_IMPORTANT',
      description: 'RESERVATION.DESC_IMPORTANT',
      icon: 'reservations/important.svg',
      route: 'important',
      status: ['progress', 'completed'],
    },
    // {
    //   id: 0,
    //   title: 'RESERVATION.TITLE_PASSPORT',
    //   description: 'RESERVATION.DESC_PASSPORT',
    //   icon: 'reservations/passport.svg',
    //   route: 'passport',
    //   status: ['progress', 'completed'],
    // },
  ];

  public data: any;
  public loading = false;
  public codeReservation: any;

  constructor(
    private active: ActivatedRoute,
    private modalService: ModalsService,
    private router: Router,
    private service: ReservationService
  ) { }

  ngOnInit(): void {
    this.codeReservation = this.active.snapshot.params.id;
    this.service.setCode(this.codeReservation);
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    this.data = await this.service.getData();
    this.loading = false;
  }

  goto(str: string, flag = false) {
    if (flag) {
      if (str !== 'trips') {
        this.router.navigate([`/trips/${this.codeReservation}/${str}`]);
      } else {
        const { itinerary } = this.data;
        const data = { tour: { itinerary } };
        this.modalService.openComponent(
          data,
          MainModalMapItineraryComponent,
          'modal-lg w-100'
        );
      }
    }
  }
}
