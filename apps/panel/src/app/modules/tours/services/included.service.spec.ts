import { TestBed } from '@angular/core/testing';

import { IncludedService } from './included.service';

describe('IncludedService', () => {
  let service: IncludedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncludedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
