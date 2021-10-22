import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPayAmountComponent } from './modal-pay-amount.component';

describe('ModalPayAmountComponent', () => {
  let component: ModalPayAmountComponent;
  let fixture: ComponentFixture<ModalPayAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalPayAmountComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPayAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
