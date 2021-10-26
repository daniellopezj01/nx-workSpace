import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIncludeComponent } from './form-include.component';

describe('FormIncludeComponent', () => {
  let component: FormIncludeComponent;
  let fixture: ComponentFixture<FormIncludeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormIncludeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormIncludeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
