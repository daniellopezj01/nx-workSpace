import {
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { DetailsItineraryService } from './services/details-itinerary.service';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { isPlatformBrowser } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-details-itinerary',
  templateUrl: './details-itinerary.component.html',
  styleUrls: ['./details-itinerary.component.scss'],
})
export class DetailsItineraryComponent implements OnInit {
  @Input() tour: any = {};
  @Input() small = true;

  public faMapMarkerAlt = faMapMarkerAlt;
  public activeClass?: boolean = false;

  constructor(
    private detailsService: DetailsItineraryService,
    public deviceService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnInit(): void {
    this.detailsService.listenActionCity.subscribe((positionCity) => {
      // llevar scroll al id city
      if (isPlatformBrowser(this.platformId)) {
        const positionElement = `__itinerary${positionCity}`;
        // this.detailsService.setCity(nameCity);
        const el = document.getElementById(positionElement as string);
        if (!this.small && el) {
          const topPos = el.offsetTop;
          const element = document.getElementById('containerItinerary');
          if (element) {
            element.scrollTo({ top: topPos, behavior: 'smooth' });
          }
        }
        setTimeout(() => {
          this.detailsService.setbooleanCity(false);
        }, 500);
      }
    });
  }

  callViewPort(event: any) {
    if (event.visible && this.deviceService.isDesktop()) {
      this.detailsService.eventViewPort.emit(event.target.id);
    }
  }

  closeModal() {
    this.detailsService.close();
  }
}
