import { Component, HostListener, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { FilterReviewsService } from '../filter-reviews/services/filter-reviews.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ModalsService } from 'apps/front/src/app/core/services/modals.service';

@Component({
  selector: 'app-all-reviews',
  templateUrl: './all-reviews.component.html',
  styleUrls: ['./all-reviews.component.scss'],
})
export class AllReviewsComponent implements OnInit {

  @Input() tour: any;
  public data: any = [];
  public dataShow: any = [];
  public loading: boolean = false;
  public limit = 10;
  public page = 1;

  constructor(
    public filter: FilterReviewsService,
    @Inject(PLATFORM_ID) private platformId: any,
    public translate: TranslateService,
    private modalService: ModalsService
  ) {
    this.data = this.filter.currentData;
  }



  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event: any) {
    if (isPlatformBrowser(this.platformId)) {
    }
  }

  ngOnInit(): void {
    this.filter.changeData.subscribe((dataAfterFilter) => {
      this.data = dataAfterFilter;
      this.page = 1;
      this.dataShow = _.slice(this.data, 0, this.limit * this.page);
    });
    this.dataShow = _.slice(this.data, 0, this.limit * this.page);
  }

  progress = () => (this.dataShow.length * 100) / this.data?.length;

  closeModal() {
    this.modalService.close();
  }

  moreData() {
    if (isPlatformBrowser(this.platformId)) {
      this.loading = true;
      setTimeout(() => {
        this.page = this.page + 1;
        this.dataShow = _.slice(this.data, 0, this.limit * this.page);
        this.loading = false;
      }, 100);
    }
  }

  gotoTop() {
    if (isPlatformBrowser(this.platformId)) {
      const el = document.getElementById('containerReviews');
      if (el) {
        // el.scrollTo(0, 0);
        el.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
}
