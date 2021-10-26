import { TestBed } from '@angular/core/testing';

import { MediaVideoService } from './media-video.service';

describe('MediaVideoService', () => {
  let service: MediaVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
