import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStopsComponent } from './modal-stops.component';

describe('ModalStopsComponent', () => {
  let component: ModalStopsComponent;
  let fixture: ComponentFixture<ModalStopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalStopsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalStopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
