import { TestBed } from '@angular/core/testing';

import { FilterItemsService } from './filter-items.service';

describe('FilterItemsService', () => {
  let service: FilterItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
