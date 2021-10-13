import { TestBed } from '@angular/core/testing';

import { FilterFlightService } from './filter-flight.service';

describe('FilterFlightService', () => {
  let service: FilterFlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterFlightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
