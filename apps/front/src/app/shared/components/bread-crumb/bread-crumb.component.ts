import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumbService } from './services/bread-crumb.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.scss']
})
export class BreadCrumbComponent implements OnInit {
  public history: any = [];
  constructor(
    private breadService: BreadCrumbService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.history = this.breadService.breadCrumbs;
  }

  goTo(a: any) {
    const array = this.breadService.breadCrumbs;
    const isReservation = array[2];
    const segmentsRoute = [a];
    switch (a) {
      case 'trips':
        segmentsRoute.unshift('user');
        break;
      case isReservation:
        segmentsRoute.unshift('trips');
        break;
      default:
        break;
    }
    this.router.navigate(segmentsRoute);
  }
}

