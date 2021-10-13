import { TestBed } from '@angular/core/testing';

import { TourDetailsService } from './tour-details.service';

describe('TourDetailsService', () => {
  let service: TourDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
