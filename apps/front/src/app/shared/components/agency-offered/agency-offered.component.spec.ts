import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyOfferedComponent } from './agency-offered.component';

describe('AgencyOfferedComponent', () => {
  let component: AgencyOfferedComponent;
  let fixture: ComponentFixture<AgencyOfferedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyOfferedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyOfferedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
