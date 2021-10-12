import { DeviceDetectorService } from 'ngx-device-detector';
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
import { TourDetailsService } from '../../services/tour-details.service';
@Component({
  selector: 'app-external-header',
  templateUrl: './external-header.component.html',
  styleUrls: ['./external-header.component.scss']
})
export class ExternalHeaderComponent implements OnInit {
  @Input() tour: any;
  faMapMarkerAlt = faMapMarkerAlt;
  public images: Image[] = [];

  public youtubeOptions: any;
  public checkDiscount: any;

  public numberImage?: number;
  public numberSmallImage = 4;
  public beginImages?: number;
  public amountSave = 0;
  public defaultTransport = '';
  public customFullDescription: Description = {
    strategy: DescriptionStrategy.HIDE_IF_EMPTY,
  };

  constructor(
    private library: FaIconLibrary,
    private detailService: TourDetailsService,
    private galleryService: GalleryService,
    public deviceService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    library.addIcons(faGlobeAmericas, faBusAlt, faUsers, faCalendarDay, faCity, faMapMarkerAlt);
  }

  ngOnInit(): void {

    this.numberImage = this.tour?.video ? 4 : 5;
    this.beginImages = this.tour?.video ? 0 : 1;
    let index = 0;
    _.map(this.tour.attached, (a, i) => {
      this.images.push(new Image(index, { img: a.source.original }));
      index++;
    });
    this.tour.dates = _.head(this.tour.departures);
    const { bestDeparture } = this.tour;
    if (bestDeparture?.specialPrice) {
      this.amountSave = bestDeparture?.normalPrice - bestDeparture?.specialPrice;
    }
  }

  transport = () => {
    let str = '';
    if (this.tour.transport.length) {
      _.map(this.tour.transport, (a) => {
        str += `${a.name}/`;
      });
      return str.slice(0, -1);
    } else {
      return this.defaultTransport;
    }
  }

  openCarousel(indexImage: any) {
    this.galleryService.openGallery(10, indexImage);
  }

  showNavigationDetailTour(event: any) {
    if (this.deviceService.isDesktop() || this.deviceService.isTablet()) {
      this.detailService.navigationTour.emit(event.visible);
    }
  }
}
