import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardReviewComponent } from './card-review.component';

describe('CardReviewComponent', () => {
  let component: CardReviewComponent;
  let fixture: ComponentFixture<CardReviewComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CardReviewComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CardReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
