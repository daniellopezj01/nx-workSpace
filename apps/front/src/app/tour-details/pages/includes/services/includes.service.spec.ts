import { TestBed } from '@angular/core/testing';

import { IncludesService } from './includes.service';

describe('IncludesService', () => {
  let service: IncludesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncludesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
