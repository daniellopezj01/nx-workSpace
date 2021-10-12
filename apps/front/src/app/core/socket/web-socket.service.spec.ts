import { TestBed } from '@angular/core/testing';

import { SocketProviderConnect } from './web-socket.service';

describe('WebSocketService', () => {
  let service: SocketProviderConnect;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketProviderConnect);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
