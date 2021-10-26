import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTypeReferrealsComponent } from './list-type-referreals.component';

describe('ListTypeReferrealsComponent', () => {
  let component: ListTypeReferrealsComponent;
  let fixture: ComponentFixture<ListTypeReferrealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTypeReferrealsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTypeReferrealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
