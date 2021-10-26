import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerGalleryComponent } from './manager-gallery.component';

describe('ManagerGalleryComponent', () => {
  let component: ManagerGalleryComponent;
  let fixture: ComponentFixture<ManagerGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
