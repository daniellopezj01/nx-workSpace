import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyCallbackComponent } from './agency-callback.component';

describe('AgencyCallbackComponent', () => {
  let component: AgencyCallbackComponent;
  let fixture: ComponentFixture<AgencyCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgencyCallbackComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
