import { TestBed } from '@angular/core/testing';

import { TextRichService } from './text-rich.service';

describe('TextRichService', () => {
  let service: TextRichService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextRichService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
