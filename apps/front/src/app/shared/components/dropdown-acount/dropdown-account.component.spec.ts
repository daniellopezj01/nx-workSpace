import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DropdownAccountComponent } from './dropdown-account.component';

describe('DropdownAcountComponent', () => {
  let component: DropdownAccountComponent;
  let fixture: ComponentFixture<DropdownAccountComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DropdownAccountComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
