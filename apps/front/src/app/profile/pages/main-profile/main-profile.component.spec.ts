import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainProfileComponent } from './main-profile.component';

describe('MainProfileComponent', () => {
  let component: MainProfileComponent;
  let fixture: ComponentFixture<MainProfileComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MainProfileComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MainProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
