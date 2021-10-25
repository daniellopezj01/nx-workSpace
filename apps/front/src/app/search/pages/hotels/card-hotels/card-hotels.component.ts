import { RestService } from './../../../../core/services/rest.service';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-card-hotels',
  templateUrl: './card-hotels.component.html',
  styleUrls: ['./card-hotels.component.scss'],
})
export class CardHotelsComponent implements OnInit {
  @Input() hotel: any;

  constructor(
    private decimalPipe: DecimalPipe,
    private translate: TranslateService,
    private rest: RestService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnInit(): void {
    console.log('cardHOTEL ')
  }

  // roundValue = (value) => round(value, 1);

  // goToReferred() {
  //   window.open(this.hotel.fullUrl, '_blank');
  // }

  getFullUrl(hotel: any) {
    const { checkIn, checkOut, adultsCount, currency } = hotel.searchParams;
    this.rest
      .post(`plugins/travelpayouts-api-hotels/events/get_hotel_single`, {
        params: {
          sortBy: 'popularity',
          hotelId: hotel?.hotel_id,
          checkIn,
          checkOut,
          adultsCount,
          childrenCount: '0',
          limit: 1,
          currency,
        },
      })
      .subscribe((res: any) => {
        const { result } = res;
        const single: any = _.head(result);
        if (isPlatformBrowser(this.platformId)) {
          window.open(single.fullUrl);
        }
      });
  }
}
