import { Component, OnInit } from '@angular/core';
import { FilterReviewsService } from './services/filter-reviews.service';

@Component({
  selector: 'app-filter-reviews',
  templateUrl: './filter-reviews.component.html',
  styleUrls: ['./filter-reviews.component.scss'],
})
export class FilterReviewsComponent implements OnInit {
  constructor(public filterService: FilterReviewsService) {}

  ngOnInit(): void {}

  changeFilter(event = { value: 0 }) {
    this.filterService.actionFilter(event);
  }
}
