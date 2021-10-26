import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsReferredComponent } from './details-referred.component';

describe('DetailsReferredComponent', () => {
  let component: DetailsReferredComponent;
  let fixture: ComponentFixture<DetailsReferredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsReferredComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsReferredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
