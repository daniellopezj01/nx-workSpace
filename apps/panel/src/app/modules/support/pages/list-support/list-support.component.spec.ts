import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSupportComponent } from './list-support.component';

describe('ListSupportComponent', () => {
  let component: ListSupportComponent;
  let fixture: ComponentFixture<ListSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
