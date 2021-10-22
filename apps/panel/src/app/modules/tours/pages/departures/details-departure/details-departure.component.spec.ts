import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsDepartureComponent } from './details-departure.component';

describe('DetailsDepartureComponent', () => {
  let component: DetailsDepartureComponent;
  let fixture: ComponentFixture<DetailsDepartureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsDepartureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsDepartureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
