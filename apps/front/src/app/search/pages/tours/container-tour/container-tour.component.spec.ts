import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContainerTourComponent } from './container-tour.component';

describe('ContainerTourComponent', () => {
  let component: ContainerTourComponent;
  let fixture: ComponentFixture<ContainerTourComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContainerTourComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
