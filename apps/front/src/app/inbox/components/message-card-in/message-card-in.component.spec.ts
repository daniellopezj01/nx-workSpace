import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCardInComponent } from './message-card-in.component';

describe('MessageCardInComponent', () => {
  let component: MessageCardInComponent;
  let fixture: ComponentFixture<MessageCardInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageCardInComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageCardInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
