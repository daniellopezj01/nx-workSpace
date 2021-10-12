import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainModalMapItineraryComponent } from './main-modal-map-itinerary.component';

describe('MainModalMapItineraryComponent', () => {
  let component: MainModalMapItineraryComponent;
  let fixture: ComponentFixture<MainModalMapItineraryComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MainModalMapItineraryComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MainModalMapItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
