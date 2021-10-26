import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTourComponent } from './form-tour.component';

describe('FormTourComponent', () => {
  let component: FormTourComponent;
  let fixture: ComponentFixture<FormTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormTourComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
