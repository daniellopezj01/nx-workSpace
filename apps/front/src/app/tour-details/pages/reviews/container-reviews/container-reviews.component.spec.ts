import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContainerReviewsComponent } from './container-reviews.component';

describe('ContainerReviewsComponent', () => {
  let component: ContainerReviewsComponent;
  let fixture: ComponentFixture<ContainerReviewsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContainerReviewsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
