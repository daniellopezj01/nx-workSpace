import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainCreateReservationComponent } from './main-create-reservation.component';

describe('MainCreateReservationComponent', () => {
  let component: MainCreateReservationComponent;
  let fixture: ComponentFixture<MainCreateReservationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MainCreateReservationComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCreateReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
