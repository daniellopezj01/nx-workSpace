import { TestBed } from '@angular/core/testing';

import { WindowWrapService } from './window-wrap.service';

describe('WindowWrapService', () => {
  let service: WindowWrapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowWrapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
