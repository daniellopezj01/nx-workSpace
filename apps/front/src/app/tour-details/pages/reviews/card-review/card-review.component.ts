import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import {
  Description,
  DescriptionStrategy,
  GalleryService,
  Image,
} from '@ks89/angular-modal-gallery';

@Component({
  selector: 'app-card-review',
  templateUrl: './card-review.component.html',
  styleUrls: ['./card-review.component.scss'],
})
export class CardReviewComponent implements OnInit {
  @Input() review: any;
  @Input() index: any = 1;
  @Input() allComments?: boolean = false;
  creator: any;
  public preConfig = {
    visible: true,
    autoPlay: false,
    size: { width: '40px', height: '40px' }
  }
  public slideConfig = { infinite: false, sidePreviews: { show: false } }
  public image: Image[] = [];
  public customFullDescription: Description = {
    strategy: DescriptionStrategy.HIDE_IF_EMPTY,
  };


  constructor(private galleryService: GalleryService) { }

  ngOnInit(): void {
    this.creator = _.head(this.review.creator);
    if (this.review?.attachment?.source) {
      this.image.push(new Image(0, { img: this.review?.attachment?.source?.small }));
    }
    this.index = this.index * (this.allComments ? 100 : 101);
  }

  openCarousel(indexImage: any) {
    this.galleryService.openGallery(this.index, indexImage);
  }
}
