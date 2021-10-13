import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ReservationService} from '../../../reservations/reservation.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit {
  public id: any;
  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private serviceReservation: ReservationService) { }

  ngOnInit(): void {
    this.id = this.activeRouter.snapshot.params.id;
  }

  goTo() {
    if (this.id) {
      this.serviceReservation.requireUpdate = true;
      this.router.navigate(['trips', this.id]);
    } else {
      this.router.navigate(['user']);
    }
  }
}
