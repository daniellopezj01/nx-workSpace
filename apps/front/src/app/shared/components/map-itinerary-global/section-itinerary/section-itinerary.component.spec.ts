import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SectionItineraryComponent } from './section-itinerary.component';

describe('SectionItineraryComponent', () => {
  let component: SectionItineraryComponent;
  let fixture: ComponentFixture<SectionItineraryComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SectionItineraryComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
