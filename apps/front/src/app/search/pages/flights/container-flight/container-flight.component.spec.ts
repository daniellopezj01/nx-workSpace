import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContainerFlightComponent } from './container-flight.component';

describe('ContainerFlightComponent', () => {
  let component: ContainerFlightComponent;
  let fixture: ComponentFixture<ContainerFlightComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContainerFlightComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
