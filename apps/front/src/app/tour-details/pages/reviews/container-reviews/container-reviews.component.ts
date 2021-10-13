import {
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewsService } from '../reviews.service';
import { AllReviewsComponent } from '../all-reviews/all-reviews.component';
import { ModalsService } from 'apps/front/src/app/core/services/modals.service';

@Component({
  selector: 'app-container-reviews',
  templateUrl: './container-reviews.component.html',
  styleUrls: ['./container-reviews.component.scss'],
})
export class ContainerReviewsComponent implements OnInit {
  @Input() tour: any;
  loading: boolean = false;
  key: string;
  small: boolean = false;
  limitReviewsBigScreen = 3;

  constructor(
    private active: ActivatedRoute,
    private modalService: ModalsService,
    private serviceReview: ReviewsService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.key = this.active.snapshot.params.query;
  }

  ngOnInit(): void {

    this.loading = true;
    const { comments } = this.tour;
    if (comments?.length) {
      this.serviceReview.setMainData(comments);
      this.serviceReview.setScore(this.tour?.score || 0);
    }
  }

  openAllReviews() {
    const data = { tour: this.tour };
    this.modalService.openComponent(data, AllReviewsComponent, 'modal-reviews-lg');
  }

  public get data() {
    return this.serviceReview.data;
  }
}
