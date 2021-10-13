import { TestBed } from '@angular/core/testing';

import { SettingsGuardGuard } from './settings-guard.guard';

describe('SettingsGuardGuard', () => {
  let guard: SettingsGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SettingsGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
