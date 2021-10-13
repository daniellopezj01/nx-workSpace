import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyerComponent } from './buyer.component';

describe('BuyerComponent', () => {
  let component: BuyerComponent;
  let fixture: ComponentFixture<BuyerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BuyerComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
