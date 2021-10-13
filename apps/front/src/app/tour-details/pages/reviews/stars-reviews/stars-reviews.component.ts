import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ReviewsService } from '../reviews.service';
import * as _ from 'lodash';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-stars-reviews',
  templateUrl: './stars-reviews.component.html',
  styleUrls: ['./stars-reviews.component.scss'],
})
export class StarsReviewsComponent implements OnInit, AfterViewChecked {
  @Input() inReviews: boolean = false;
  data: any;
  score: number = 0;
  barScores: Array<ScoreInterface> = [];
  small: any;

  constructor(
    private reviewsService: ReviewsService,
    private cdref: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.small = window.innerWidth < 760;
    }
    this.barScores = []
  }

  ngOnInit(): void {
    this.data = this.reviewsService.getMainData;
    this.score = this.reviewsService.getScore;
    const bar = _.groupBy(this.data, 'vote');
    for (let i = 5; i >= 1; i--) {
      const num = bar[`${i}`];
      this.barScores.push({
        star: `${i}`,
        numberItems: num?.length || 0,
      });
    }
  }

  ngAfterViewChecked(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.small = window.innerWidth < 760;
    }
    this.cdref.detectChanges();
  }

  calcProgress = (length: number) => (length * 100) / this.data?.length;
}

interface ScoreInterface {
  star: string;
  numberItems: any;
}

// export class ScoreInterface {
//   star: string = '';
//   numberItems: number = 0;
// }
