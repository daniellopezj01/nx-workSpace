import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardItineraryComponent } from './card-itinerary.component';

describe('CardItineraryComponent', () => {
  let component: CardItineraryComponent;
  let fixture: ComponentFixture<CardItineraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardItineraryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
