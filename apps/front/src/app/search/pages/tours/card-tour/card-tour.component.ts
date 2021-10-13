import { DeviceDetectorService } from 'ngx-device-detector';
import {
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-card-tour',
  templateUrl: './card-tour.component.html',
  styleUrls: ['./card-tour.component.scss'],
})
export class CardTourComponent implements OnInit {
  @Input() tour: any;
  @Input() sizeCarousel = false;
  public bestDeparture: any = {};

  constructor(
    private router: Router,
    public translate: TranslateService,
    public deviceService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnInit(): void {
    const { bestDeparture } = this.tour;
    if (bestDeparture) {
      this.bestDeparture = bestDeparture;
      const { payAmount, normalPrice } = bestDeparture;
      const best = _.minBy(payAmount, (i: any) => i?.percentageAmount);
      this.bestDeparture.bestDiscount = best
      if (best?.percentageAmount !== 100) {
        this.bestDeparture.minAmount =
          (best?.percentageAmount * normalPrice) / 100;
      }
    }
  }

  gotoDetails() {
    this.router.navigate([`/destination/${this.tour.slug}`]);
  }
}
