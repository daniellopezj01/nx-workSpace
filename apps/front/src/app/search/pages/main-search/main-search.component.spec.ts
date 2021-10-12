import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainSearchComponent } from './main-search.component';

describe('MainSearchComponent', () => {
  let component: MainSearchComponent;
  let fixture: ComponentFixture<MainSearchComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MainSearchComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
