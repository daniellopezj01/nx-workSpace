import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLoginRegisterComponent } from './form-login-register.component';

describe('FormLoginRegisterComponent', () => {
  let component: FormLoginRegisterComponent;
  let fixture: ComponentFixture<FormLoginRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormLoginRegisterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLoginRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
