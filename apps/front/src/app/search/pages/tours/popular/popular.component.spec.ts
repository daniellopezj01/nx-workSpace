import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PopularComponent } from './popular.component';

describe('PopularComponent', () => {
  let component: PopularComponent;
  let fixture: ComponentFixture<PopularComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PopularComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
