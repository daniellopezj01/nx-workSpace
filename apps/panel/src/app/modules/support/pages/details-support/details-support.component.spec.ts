import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsSupportComponent } from './details-support.component';

describe('DetailsSupportComponent', () => {
  let component: DetailsSupportComponent;
  let fixture: ComponentFixture<DetailsSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
