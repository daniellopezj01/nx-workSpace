import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CartFlightsComponent } from './cart-flights.component';

describe('CartFlightsComponent', () => {
  let component: CartFlightsComponent;
  let fixture: ComponentFixture<CartFlightsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CartFlightsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CartFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
