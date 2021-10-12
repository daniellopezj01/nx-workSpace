import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterFlightComponent } from './filter-flight.component';

describe('FilterFlightComponent', () => {
  let component: FilterFlightComponent;
  let fixture: ComponentFixture<FilterFlightComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FilterFlightComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
