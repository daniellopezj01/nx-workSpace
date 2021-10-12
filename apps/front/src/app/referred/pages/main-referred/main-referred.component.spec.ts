import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainReferredComponent } from './main-referred.component';

describe('MainReferredComponent', () => {
  let component: MainReferredComponent;
  let fixture: ComponentFixture<MainReferredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainReferredComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainReferredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
