import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoToReservationComponent } from './info-to-reservation.component';

describe('InfoToReservationComponent', () => {
  let component: InfoToReservationComponent;
  let fixture: ComponentFixture<InfoToReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoToReservationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoToReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
