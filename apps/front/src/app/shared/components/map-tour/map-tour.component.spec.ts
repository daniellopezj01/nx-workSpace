import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapTourComponent } from './map-tour.component';

describe('MapTourComponent', () => {
  let component: MapTourComponent;
  let fixture: ComponentFixture<MapTourComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MapTourComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
