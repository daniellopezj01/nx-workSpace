import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalItineraryComponent } from './modal-itinerary.component';

describe('ModalItineraryComponent', () => {
  let component: ModalItineraryComponent;
  let fixture: ComponentFixture<ModalItineraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalItineraryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
