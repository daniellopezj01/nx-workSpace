import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';
import {
  faDollarSign,
  faSyncAlt,
  faUserLock,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-about-tour',
  templateUrl: './about-tour.component.html',
  styleUrls: ['./about-tour.component.scss'],
})
export class AboutTourComponent implements AfterViewInit {
  @Input() tour: any;
  public activeDegradient = true;
  public activeDefaultHeight = true;
  public height = 1;
  data: Array<any> = [
    {
      title: 'DETAILS_TOUR.BUY_CONTENT.TITLE_ONE',
      description: 'DETAILS_TOUR.BUY_CONTENT.CONTENT_ONE',
      icon: faDollarSign,
    },
    {
      title: 'DETAILS_TOUR.BUY_CONTENT.TITLE_TWO',
      description: 'DETAILS_TOUR.BUY_CONTENT.CONTENT_TWO',
      icon: faSyncAlt,
    },
    {
      title: 'DETAILS_TOUR.BUY_CONTENT.TITLE_THREE',
      description: 'DETAILS_TOUR.BUY_CONTENT.CONTENT_THREE',
      icon: faCalendarCheck,
    },
    {
      title: 'DETAILS_TOUR.BUY_CONTENT.TITLE_FOUR',
      description: 'DETAILS_TOUR.BUY_CONTENT.CONTENT_FOUR',
      icon: faUserLock,
    },
  ];
  constructor(@Inject(PLATFORM_ID) private platformId: any, private cdref: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.activeDefaultHeight = false;
    if (isPlatformBrowser(this.platformId)) {
      const buy = document.getElementById('buyInformation');
      if (buy) {
        this.height = window.innerWidth > 760 ? buy.offsetHeight : 0;
      }
    }
    this.cdref.detectChanges();
  }

  showAll() {
    this.activeDegradient = false;
    this.height = 0;
  }
}
