import { TestBed } from '@angular/core/testing';

import { InputSearchService } from './input-search.service';

describe('InputSearchService', () => {
  let service: InputSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
