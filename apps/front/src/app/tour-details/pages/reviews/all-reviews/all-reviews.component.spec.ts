import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AllReviewsComponent } from './all-reviews.component';

describe('AllReviewsComponent', () => {
  let component: AllReviewsComponent;
  let fixture: ComponentFixture<AllReviewsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AllReviewsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AllReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
