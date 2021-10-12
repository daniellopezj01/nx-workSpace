import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqTourComponent } from './faq-tour.component';

describe('FaqTourComponent', () => {
  let component: FaqTourComponent;
  let fixture: ComponentFixture<FaqTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaqTourComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
