import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SuccessChangeComponent } from './success-change.component';

describe('SuccessChangeComponent', () => {
  let component: SuccessChangeComponent;
  let fixture: ComponentFixture<SuccessChangeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SuccessChangeComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
