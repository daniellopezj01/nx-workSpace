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
  selector: 'app-header-details',
  templateUrl: './header-details.component.html',
  styleUrls: ['./header-details.component.scss'],
})
export class HeaderDetailsComponent implements OnInit {
  @Input() tour: any;
  public player: any;
  visibleVideo = false;
  faMapMarkerAlt = faMapMarkerAlt;
  public images: Image[] = [];

  public youtubeOptions: any;
  public checkDiscount: any;
  public played: any = {
    state: false,
    height: 515,
    width: '100%',
  };
  public numberImage: number = 0;
  public numberSmallImage = 4;
  public beginImages: number = 0;
  public amountSave = 0;
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
    this.youtubeOptions = {
      showinfo: 0,
      rel: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      frameborder: 0,
      controls: 2,
    };
    this.numberImage = this.tour?.video ? 4 : 5;
    this.beginImages = this.tour?.video ? 0 : 1;
    let index = 0;
    _.map(this.tour.attached, (a, i) => {
      const route = this.deviceService.isDesktop() ? a.source.medium : a.source.sm
      this.images.push(new Image(index, { img: route }));
      index++;
    });
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


  openCarousel(indexImage: any) {
    this.galleryService.openGallery(10, indexImage);
  }

  getVideo = () => {
    this.player.pauseVideo();
    this.played.state = false;
  }

  playVideo = () => {
    this.visibleVideo = !this.visibleVideo;
  }


  ready($event: any) {
    this.player = $event.target;
  }

  showNavigationDetailTour(event: any) {
    if (this.deviceService.isDesktop() || this.deviceService.isTablet()) {
      this.detailService.navigationTour.emit(event.visible);
    }
  }

  changeState($event: any) {
    if ($event?.data === 1) {
      this.played = {
        state: true,
        width: 960,
        height: 515,
      };
    }
    if ($event?.data === 2) {
      this.played = {
        state: false,
        width: '100%',
        height: 515,
      };
    }
  }
}
