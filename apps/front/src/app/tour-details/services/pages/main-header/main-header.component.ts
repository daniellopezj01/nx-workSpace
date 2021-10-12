import { DeviceDetectorService } from 'ngx-device-detector';
import { TourDetailsService } from '../../tour-details.service';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import * as _ from 'lodash';
import {
  faGlobeAmericas,
  faBusAlt,
  faUsers,
  faCalendarDay,
  faCity,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  Description,
  DescriptionStrategy,
  GalleryService,
  Image,
} from '@ks89/angular-modal-gallery';


@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  @Input() tour: any;
  faMapMarkerAlt = faMapMarkerAlt;
  public images: Image[] = [];

  public checkDiscount: any;

  public amountSave = 0;
  public customFullDescription: Description = {
    strategy: DescriptionStrategy.HIDE_IF_EMPTY,
  };

  constructor(
    private library: FaIconLibrary,
    private detailService: TourDetailsService,
    private galleryService: GalleryService,
    public deviceService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platformId
  ) {
    library.addIcons(faGlobeAmericas, faBusAlt, faUsers, faCalendarDay, faCity, faMapMarkerAlt);
  }

  ngOnInit(): void {
    this.tour.dates = _.head(this.tour.departures);
    const { bestDeparture } = this.tour;
    if (bestDeparture?.specialPrice) {
      this.amountSave = bestDeparture?.normalPrice - bestDeparture?.specialPrice;
    }
    this.checkGeneralDiscount();
  }

  checkGeneralDiscount() {
    const { bestDeparture } = this.tour;
    this.checkDiscount = _.find(
      bestDeparture?.payAmount,
      (i) => i?.percentageAmount === 100 && i.amountDiscount
    );
  }


  openCarousel(indexImage) {
    this.galleryService.openGallery(10, indexImage);
  }
}
