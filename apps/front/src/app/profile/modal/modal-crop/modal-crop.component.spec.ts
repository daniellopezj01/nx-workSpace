import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCropComponent } from './modal-crop.component';

describe('ModalCropComponent', () => {
  let component: ModalCropComponent;
  let fixture: ComponentFixture<ModalCropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalCropComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
