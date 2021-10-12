import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallLoginComponent } from './call-login.component';

describe('CallLoginComponent', () => {
  let component: CallLoginComponent;
  let fixture: ComponentFixture<CallLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallLoginComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
