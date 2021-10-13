import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeaderEmptyComponent } from './header-empty.component';

describe('HeaderEmptyComponent', () => {
  let component: HeaderEmptyComponent;
  let fixture: ComponentFixture<HeaderEmptyComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HeaderEmptyComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
