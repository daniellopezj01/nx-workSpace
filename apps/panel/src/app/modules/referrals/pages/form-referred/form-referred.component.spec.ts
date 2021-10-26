import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReferredComponent } from './form-referred.component';

describe('FormReferredComponent', () => {
  let component: FormReferredComponent;
  let fixture: ComponentFixture<FormReferredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormReferredComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReferredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
