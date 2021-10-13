import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourLanguageOfferedComponent } from './tour-language-offered.component';

describe('TourLanguageOfferedComponent', () => {
  let component: TourLanguageOfferedComponent;
  let fixture: ComponentFixture<TourLanguageOfferedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourLanguageOfferedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourLanguageOfferedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
