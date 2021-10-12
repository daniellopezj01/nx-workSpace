import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';

import * as _ from 'lodash';
import { distinctUntilChanged } from 'rxjs/operators';
import { DetailsItineraryService } from '../details-itinerary/services/details-itinerary.service';
import { DetailsItineraryComponent } from '../details-itinerary/details-itinerary.component';
import { isPlatformBrowser } from '@angular/common';
import { ModalsService } from '../../../core/services/modals.service';

@Component({
  selector: 'app-itinerary-tour',
  templateUrl: './itinerary-tour.component.html',
  styleUrls: ['./itinerary-tour.component.scss'],
})
export class ItineraryTourComponent implements OnInit, OnDestroy {
  @Input() tour: any;
  private beginValueScroll = 0;
  private raiseOrLowerScroll = false;
  private actionButtonNavigation = false;
  activePosition = 0;
  small: boolean;
  public listSubscribers: any = [];
  config: any;
  constructor(
    private serviceModal: ModalsService,
    private detailsService: DetailsItineraryService,
    @Inject(PLATFORM_ID) private platformId
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.small = window.innerWidth < 760;
    }
  }

  ngOnInit(): void {
    this.listObserver();
    this.countNight();
  }

  listObserver = () => {
    const observer1$ = this.detailsService.eventViewPort
      .pipe(distinctUntilChanged())
      .subscribe((str: string) => {
        if (!this.actionButtonNavigation) {
          // tslint:disable-next-line:radix
          const position = parseInt(str.substring(str.length - 1));
          if (!this.raiseOrLowerScroll) {
            if (position > this.activePosition) {
              this.activePosition = position;
            }
          } else {
            if (position < this.activePosition) {
              this.activePosition = position;
            }
          }
        }
      });
    this.listSubscribers.push(observer1$);
  }

  ngOnDestroy() {
    this.listSubscribers.forEach((a) => a.unsubscribe());
  }

  countNight() {
    const { itinerary } = this.tour;
    this.tour.itinerary = _.map(itinerary, (i) => {
      const { details } = i;
      i.nights = _.filter(details, (detail) => detail.isNight).length;
      return i;
    });
  }

  activeItem(position) {
    this.actionButtonNavigation = true;
    if (this.small) {
      this.serviceModal.openComponent(
        { tour: this.tour },
        DetailsItineraryComponent,
        'modal-details-itinerary'
      );
    }
    this.activePosition = position;
    this.detailsService.listenActionCity.emit(this.activePosition);
    this.detailsService.setbooleanCity(true);
    setTimeout(() => {
      this.actionButtonNavigation = false;
    }, 2000);
  }

  onScroll(event) {
    this.raiseOrLowerScroll = this.beginValueScroll > event.target.scrollTop;
    this.beginValueScroll = event.target.scrollTop;
  }
}
