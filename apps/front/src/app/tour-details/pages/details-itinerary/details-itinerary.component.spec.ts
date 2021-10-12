import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DetailsItineraryComponent } from './details-itinerary.component';

describe('DetailsItineraryComponent', () => {
  let component: DetailsItineraryComponent;
  let fixture: ComponentFixture<DetailsItineraryComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DetailsItineraryComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
