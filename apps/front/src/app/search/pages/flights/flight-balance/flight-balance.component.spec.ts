import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightBalanceComponent } from './flight-balance.component';

describe('FlightBalanceComponent', () => {
  let component: FlightBalanceComponent;
  let fixture: ComponentFixture<FlightBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
