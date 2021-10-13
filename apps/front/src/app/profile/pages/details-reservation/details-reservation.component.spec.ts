import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DetailsReservationComponent } from './details-reservation.component';

describe('DetailsReservationComponent', () => {
  let component: DetailsReservationComponent;
  let fixture: ComponentFixture<DetailsReservationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DetailsReservationComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
