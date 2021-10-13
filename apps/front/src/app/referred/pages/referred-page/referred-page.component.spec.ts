import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferredPageComponent } from './referred-page.component';

describe('ReferredPageComponent', () => {
  let component: ReferredPageComponent;
  let fixture: ComponentFixture<ReferredPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferredPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferredPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
