import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StarsReviewsComponent } from './stars-reviews.component';

describe('StarsReviewsComponent', () => {
  let component: StarsReviewsComponent;
  let fixture: ComponentFixture<StarsReviewsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StarsReviewsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StarsReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
