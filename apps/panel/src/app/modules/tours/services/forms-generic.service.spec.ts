import { TestBed } from '@angular/core/testing';

import { FormsGenericService } from './forms-generic.service';

describe('FormsGenericService', () => {
  let service: FormsGenericService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormsGenericService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
