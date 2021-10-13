import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeginTourComponent } from './begin-tour.component';

describe('BeginTourComponent', () => {
  let component: BeginTourComponent;
  let fixture: ComponentFixture<BeginTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeginTourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeginTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
