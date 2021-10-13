import { EventEmitter, Injectable } from '@angular/core';
import { ReviewsService } from '../../reviews.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class FilterReviewsService {
  changeData = new EventEmitter<any>();

  starNumber = 5;
  stars = [
    {
      name: 'All Reviews',
      value: 0,
    },
  ];

  selectedFilter = this.stars[0].name;
  filterData: any;
  allData: any;
  currentData: any;

  constructor(private mainService: ReviewsService) {
    this.allData = this.mainService.getMainData;
    this.currentData = _.clone(this.mainService.getMainData);
    this.loadSelect();
  }

  loadSelect() {
    for (let i = 5; i >= 1; i--) {
      this.stars.push({
        name: `${i} stars`,
        value: i,
      });
    }
  }

  actionFilter(action: any) {
    const { value } = action;
    this.currentData = this.mainService.getMainData;
    if (!value) {
      this.selectedFilter = this.stars[0].name;
      this.changeData.emit(this.currentData);
    } else {
      this.currentData = _.filter(this.currentData, (a) => a.vote === value);
      this.changeData.emit(this.currentData);
    }
  }
}
