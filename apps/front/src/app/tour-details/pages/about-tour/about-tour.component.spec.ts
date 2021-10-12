import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AboutTourComponent } from './about-tour.component';

describe('AboutTourComponent', () => {
  let component: AboutTourComponent;
  let fixture: ComponentFixture<AboutTourComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AboutTourComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
