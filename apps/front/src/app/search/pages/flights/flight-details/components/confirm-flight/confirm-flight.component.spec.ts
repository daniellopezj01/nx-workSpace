import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmFlightComponent } from './confirm-flight.component';

describe('ConfirmFlightComponent', () => {
  let component: ConfirmFlightComponent;
  let fixture: ComponentFixture<ConfirmFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmFlightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
