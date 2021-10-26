import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsTypeReferrealsComponent } from './details-type-referreals.component';

describe('DetailsTypeReferrealsComponent', () => {
  let component: DetailsTypeReferrealsComponent;
  let fixture: ComponentFixture<DetailsTypeReferrealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsTypeReferrealsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsTypeReferrealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
