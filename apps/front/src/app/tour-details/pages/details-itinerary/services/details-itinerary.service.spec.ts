import { TestBed } from '@angular/core/testing';

import { DetailsItineraryService } from './details-itinerary.service';

describe('DetailsItineraryService', () => {
  let service: DetailsItineraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsItineraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
