import { TestBed } from '@angular/core/testing';

import { TemplatesHeadersService } from './templates-headers.service';

describe('TemplatesHeadersService', () => {
  let service: TemplatesHeadersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplatesHeadersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
