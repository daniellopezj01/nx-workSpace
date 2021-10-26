import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTypeReferrealsComponent } from './form-type-referreals.component';

describe('FormTypeReferrealsComponent', () => {
  let component: FormTypeReferrealsComponent;
  let fixture: ComponentFixture<FormTypeReferrealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTypeReferrealsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTypeReferrealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
