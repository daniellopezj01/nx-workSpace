import { TestBed } from '@angular/core/testing';

import { FilterReviewsService } from './filter-reviews.service';

describe('FilterReviewsService', () => {
  let service: FilterReviewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterReviewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
