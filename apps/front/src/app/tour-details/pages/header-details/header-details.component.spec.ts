import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeaderDetailsComponent } from './header-details.component';

describe('HeaderDetailsComponent', () => {
  let component: HeaderDetailsComponent;
  let fixture: ComponentFixture<HeaderDetailsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HeaderDetailsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
