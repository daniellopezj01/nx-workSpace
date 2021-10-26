import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDeparturesComponent } from './card-departures.component';

describe('CardDeparturesComponent', () => {
  let component: CardDeparturesComponent;
  let fixture: ComponentFixture<CardDeparturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardDeparturesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDeparturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
