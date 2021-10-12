import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainDeparturesComponent } from './main-departures.component';

describe('MainDeparturesComponent', () => {
  let component: MainDeparturesComponent;
  let fixture: ComponentFixture<MainDeparturesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MainDeparturesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MainDeparturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
