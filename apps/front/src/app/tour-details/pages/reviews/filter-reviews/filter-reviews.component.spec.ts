import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterReviewsComponent } from './filter-reviews.component';

describe('FilterReviewsComponent', () => {
  let component: FilterReviewsComponent;
  let fixture: ComponentFixture<FilterReviewsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FilterReviewsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
