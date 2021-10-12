import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PassSendEmailComponent } from './pass-send-email.component';

describe('PassSendEmailComponent', () => {
  let component: PassSendEmailComponent;
  let fixture: ComponentFixture<PassSendEmailComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PassSendEmailComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PassSendEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
