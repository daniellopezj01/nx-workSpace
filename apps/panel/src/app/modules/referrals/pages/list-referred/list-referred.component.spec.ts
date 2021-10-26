import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReferredComponent } from './list-referred.component';

describe('ListReferredComponent', () => {
  let component: ListReferredComponent;
  let fixture: ComponentFixture<ListReferredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListReferredComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReferredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
