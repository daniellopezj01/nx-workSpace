import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItineraryTourComponent } from './itinerary-tour.component';

describe('ItineraryTourComponent', () => {
  let component: ItineraryTourComponent;
  let fixture: ComponentFixture<ItineraryTourComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ItineraryTourComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
