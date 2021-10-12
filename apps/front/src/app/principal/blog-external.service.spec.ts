import { TestBed } from '@angular/core/testing';

import { BlogExternalService } from './blog-external.service';

describe('BlogExternalService', () => {
  let service: BlogExternalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogExternalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
