import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmptySearchComponent } from './empty-search.component';

describe('EmptySearchComponent', () => {
  let component: EmptySearchComponent;
  let fixture: ComponentFixture<EmptySearchComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EmptySearchComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
