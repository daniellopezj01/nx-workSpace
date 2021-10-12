import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatsSupportComponent } from './chats-support.component';

describe('ChatsSupportComponent', () => {
  let component: ChatsSupportComponent;
  let fixture: ComponentFixture<ChatsSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatsSupportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatsSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
