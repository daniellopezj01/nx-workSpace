import { TestBed } from '@angular/core/testing';

import { CheckReferredGuard } from './check-referred.guard';

describe('CheckReferredGuard', () => {
  let guard: CheckReferredGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckReferredGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
