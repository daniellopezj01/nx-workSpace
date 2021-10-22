import { TestBed } from '@angular/core/testing';

import { DetailsTourService } from './details-tour.service';

describe('DetailsTourService', () => {
  let service: DetailsTourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsTourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
