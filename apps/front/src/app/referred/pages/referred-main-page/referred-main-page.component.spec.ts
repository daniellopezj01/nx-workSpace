import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferredMainPageComponent } from './referred-main-page.component';

describe('ReferredMainPageComponent', () => {
  let component: ReferredMainPageComponent;
  let fixture: ComponentFixture<ReferredMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferredMainPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferredMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
