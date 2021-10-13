import { TestBed } from '@angular/core/testing';

import { FilterHotelService } from './filter-hotel.service';

describe('FilterHotelService', () => {
  let service: FilterHotelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterHotelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
