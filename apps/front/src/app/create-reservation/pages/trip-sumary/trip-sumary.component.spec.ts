import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TripSumaryComponent } from './trip-sumary.component';

describe('TripSumaryComponent', () => {
  let component: TripSumaryComponent;
  let fixture: ComponentFixture<TripSumaryComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TripSumaryComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TripSumaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
