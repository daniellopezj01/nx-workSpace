import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContainerHotelComponent } from './container-hotel.component';

describe('ContainerHotelComponent', () => {
  let component: ContainerHotelComponent;
  let fixture: ComponentFixture<ContainerHotelComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContainerHotelComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
