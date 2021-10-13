import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateWayTravelComponent } from './template-way-travel.component';

describe('TemplateWayTravelComponent', () => {
  let component: TemplateWayTravelComponent;
  let fixture: ComponentFixture<TemplateWayTravelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateWayTravelComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateWayTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
