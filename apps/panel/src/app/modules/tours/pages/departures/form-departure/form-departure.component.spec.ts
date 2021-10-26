import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDepartureComponent } from './form-departure.component';

describe('FormDepartureComponent', () => {
  let component: FormDepartureComponent;
  let fixture: ComponentFixture<FormDepartureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDepartureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDepartureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
