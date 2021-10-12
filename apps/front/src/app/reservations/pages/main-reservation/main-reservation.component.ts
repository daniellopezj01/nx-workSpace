import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-reservation',
  templateUrl: './main-reservation.component.html',
  styleUrls: ['./main-reservation.component.scss'],
})
export class MainReservationComponent implements OnInit {
  activeFooter = true;
  constructor(router: Router
  ) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeFooter = !event.url.toString().includes('support/');
      });
  }

  ngOnInit(): void { }
}
