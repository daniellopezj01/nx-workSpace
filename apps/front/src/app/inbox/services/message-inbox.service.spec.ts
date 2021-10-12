import { TestBed } from '@angular/core/testing';

import { MessageInboxService } from './message-inbox.service';

describe('MessageInboxService', () => {
  let service: MessageInboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageInboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
