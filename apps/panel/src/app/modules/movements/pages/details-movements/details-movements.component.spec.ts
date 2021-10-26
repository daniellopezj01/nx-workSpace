import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsMovementsComponent } from './details-movements.component';

describe('DetailsMovementsComponent', () => {
  let component: DetailsMovementsComponent;
  let fixture: ComponentFixture<DetailsMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsMovementsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
