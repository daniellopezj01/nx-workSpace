import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-details-reservation',
  templateUrl: './details-reservation.component.html',
  styleUrls: ['./details-reservation.component.scss'],
})
export class DetailsReservationComponent implements OnInit {
  public loading = true;
  public data: any;
  public formAction = false;

  constructor(private rest: RestService, private active: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.active.snapshot.params.id;
    this.rest.get(`reservations/${id}`).subscribe(
      (res) => {
        this.loading = false;
        this.data = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
