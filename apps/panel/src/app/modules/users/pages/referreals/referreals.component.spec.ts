import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferrealsComponent } from './referreals.component';

describe('ReferrealsComponent', () => {
  let component: ReferrealsComponent;
  let fixture: ComponentFixture<ReferrealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferrealsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferrealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
