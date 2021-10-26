import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropGalleryComponent } from './drop-gallery.component';

describe('DropGaleryComponent', () => {
  let component: DropGalleryComponent;
  let fixture: ComponentFixture<DropGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropGalleryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
