import { TestBed } from '@angular/core/testing';

import { TripsServiceService } from './trips-service.service';

describe('TripsServiceService', () => {
  let service: TripsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
