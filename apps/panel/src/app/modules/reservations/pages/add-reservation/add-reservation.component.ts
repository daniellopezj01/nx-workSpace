import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.scss'],
})
export class AddReservationComponent implements OnInit {
  public id: any = false;

  constructor(
    private route: ActivatedRoute,
    private share: SharedService,
    public router: Router
  ) { }

  public history: any = [
    {
      name: 'Reservations',
      router: ['/'],
    },
    {
      name: 'Agregar',
      router: null,
    },
  ];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params.id === 'add' ? '' : params.id;
    });
  }

  save = () => {
    this.share.confirm().then(() => {
      this.share.saveTour.emit(true);
    });
  };
}
