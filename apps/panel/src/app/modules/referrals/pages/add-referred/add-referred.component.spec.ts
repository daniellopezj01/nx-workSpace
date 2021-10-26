import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReferredComponent } from './add-referred.component';

describe('AddReferredComponent', () => {
  let component: AddReferredComponent;
  let fixture: ComponentFixture<AddReferredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddReferredComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReferredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
