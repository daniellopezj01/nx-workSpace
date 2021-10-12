import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardHotelsComponent } from './card-hotels.component';

describe('CardHotelsComponent', () => {
  let component: CardHotelsComponent;
  let fixture: ComponentFixture<CardHotelsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CardHotelsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CardHotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
