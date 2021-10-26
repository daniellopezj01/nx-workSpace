import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeReferrealsComponent } from './add-type-referreals.component';

describe('AddTypeReferrealsComponent', () => {
  let component: AddTypeReferrealsComponent;
  let fixture: ComponentFixture<AddTypeReferrealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTypeReferrealsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTypeReferrealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
