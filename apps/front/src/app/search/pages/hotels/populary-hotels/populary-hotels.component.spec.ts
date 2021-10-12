import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PopularyHotelsComponent } from './populary-hotels.component';

describe('PopularyHotelsComponent', () => {
  let component: PopularyHotelsComponent;
  let fixture: ComponentFixture<PopularyHotelsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PopularyHotelsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularyHotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
