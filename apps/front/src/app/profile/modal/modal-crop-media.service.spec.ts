import { TestBed } from '@angular/core/testing';

import { ModalCropMediaService } from './modal-crop-media.service';

describe('ModalCropMediaService', () => {
  let service: ModalCropMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalCropMediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
