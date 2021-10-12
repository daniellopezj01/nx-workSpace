import { ReviewsService } from '../reviews/reviews.service';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  catchError,
  tap,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { Subscription, throwError } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TourDetailsService } from '../../services/tour-details.service';
import { environment } from '../../../../environments/environment';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-main-details',
  templateUrl: './main-details.component.html',
  styleUrls: ['./main-details.component.scss'],
})
export class MainDetailsComponent implements OnInit, OnDestroy {
  private actionButtonNavigation = false;
  private raiseOrLowerScroll = false;
  public key: any;
  public loading = false;
  public tour: any = {};
  public showGlobalNavigation = true;
  public listSubscribers: any = [];
  public amountSave = 0;
  public itemsNavigation = [
    { name: 'DETAILS_TOUR.FIXED_HEADER.TOP', idSection: 'headerTour' },
    { name: 'DETAILS_TOUR.FIXED_HEADER.ABOUT', idSection: 'aboutTour' },
    { name: 'DETAILS_TOUR.FIXED_HEADER.ITINERARY', idSection: 'itineraryMap' },
    { name: 'DETAILS_TOUR.FIXED_HEADER.DETAILS', idSection: 'includesTour' },
    { name: 'DETAILS_TOUR.FIXED_HEADER.FAQ', idSection: 'FAQS' },
  ];
  public activeNavigate = 'headerTour';
  public checkDiscount: any;
  //
  // @HostListener('window:scroll', ['$event']) // for window scroll events
  // onScroll(event) {
  //   if (isPlatformBrowser(this.platformId) && this.deviceService.isDesktop()) {
  //     this.raiseOrLowerScroll = this.beginValueScroll > window.pageYOffset;
  //     this.beginValueScroll = window.pageYOffset;
  //   }
  // }

  constructor(
    private route: ActivatedRoute,
    private rest: RestService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private title: Title,
    private reviewsService: ReviewsService,
    private detailService: TourDetailsService,
    public deviceService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnInit(): void {
    this.reviewsService.clearReviews();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.key = params.get('query');
      this.loadData();
    });
    this.listObserver();
  }

  listObserver() {
    const observer1 = this.detailService.navigationTour
      .pipe(distinctUntilChanged(), debounceTime(200))
      .subscribe((res) => {
        this.showGlobalNavigation = res;
      });
    const observer2 = this.detailService.sectionTour
      .pipe(distinctUntilChanged())
      .subscribe((res) => {
        this.activeNavigate = res;
      });
    this.listSubscribers.push(observer1, observer2);
  }

  ngOnDestroy() {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }

  loadData(): any {
    this.loading = true;
    this.rest
      .get(`tours/${this.key}`)
      .pipe(
        tap(() => (this.loading = false)),
        catchError((err) => {
          this.loading = err;
          return throwError(err);
        })
      )
      .subscribe(
        (res) => {
          this.tour = res;
          this.title.setTitle(`${res?.title} ${environment.title}`);
          const { bestDeparture } = this.tour;
          if (bestDeparture?.specialPrice) {
            this.amountSave =
              bestDeparture?.normalPrice - bestDeparture?.specialPrice;
          }
          this.checkGeneralDiscount();
          this.loading = false;
        },
        (err) => {
          this.router.navigate(['/']);
        }
      );
  }

  checkGeneralDiscount() {
    const { bestDeparture } = this.tour;
    this.checkDiscount = _.find(
      bestDeparture?.payAmount,
      (i) => i?.percentageAmount === 100 && i.amountDiscount
    );
  }

  goToSection(id: any) {
    if (isPlatformBrowser(this.platformId)) {
      const el = document.getElementById(id);
      if (el) {
        this.actionButtonNavigation = true;
        window.scrollTo({ top: el.offsetTop - 150, behavior: 'smooth' });
        this.activeNavigate = id;
        setTimeout(() => {
          this.actionButtonNavigation = false;
        }, 2000);
      }
    }
  }

  activeSection($event: any, idSection: any) {
    if (isPlatformBrowser(this.platformId) && this.deviceService.isDesktop()) {
      if ($event.visible && !this.actionButtonNavigation) {
        const current: any = document.getElementById(this.activeNavigate);
        const newSection: any = document.getElementById(idSection);
        if (!this.raiseOrLowerScroll) {
          if (newSection.offsetTop > current?.offsetTop) {
            this.detailService.sectionTour.emit(idSection);
          }
        } else {
          if (newSection.offsetTop < current?.offsetTop) {
            this.detailService.sectionTour.emit(idSection);
          }
        }
      }
    }

  }
}
