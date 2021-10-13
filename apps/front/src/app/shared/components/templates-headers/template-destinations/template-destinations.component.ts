import { Router } from '@angular/router';
import { AfterContentChecked, Component } from '@angular/core';
import { TemplatesHeadersService } from '../templates-headers.service';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-template-destinations',
  templateUrl: './template-destinations.component.html',
  styleUrls: ['./template-destinations.component.scss'],
})
export class TemplateDestinationsComponent implements AfterContentChecked {
  tours: any = [];

  constructor(
    public service: TemplatesHeadersService,
    private router: Router,
    public translate: TranslateService
  ) { }

  continents: any = [];


  ngAfterContentChecked(): void {
    if (!this.service.loading) {
      this.tours = _.slice(
        _.orderBy(this.service.allTours, [(o) => o.score || ''], ['desc']),
        0,
        5
      );
    }
  }

  gotoDetails(tour: any) {
    this.router.navigate([`/destination/${tour.slug}`]);
  }
}
