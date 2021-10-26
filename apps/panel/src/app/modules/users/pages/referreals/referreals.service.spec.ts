import { TestBed } from '@angular/core/testing';

import { ReferrealsService } from './referreals.service';

describe('ReferrealsService', () => {
  let service: ReferrealsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferrealsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
