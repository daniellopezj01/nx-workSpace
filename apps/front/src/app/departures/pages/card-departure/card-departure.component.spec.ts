import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardDepartureComponent } from './card-departure.component';

describe('CardDepartureComponent', () => {
  let component: CardDepartureComponent;
  let fixture: ComponentFixture<CardDepartureComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CardDepartureComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDepartureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
