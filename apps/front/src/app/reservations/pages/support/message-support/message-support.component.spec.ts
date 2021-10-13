import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSupportComponent } from './message-support.component';

describe('MessageSupportComponent', () => {
  let component: MessageSupportComponent;
  let fixture: ComponentFixture<MessageSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageSupportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
