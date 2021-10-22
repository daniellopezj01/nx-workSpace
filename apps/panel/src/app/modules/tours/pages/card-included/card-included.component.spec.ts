import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardIncludedComponent } from './card-included.component';

describe('CardIncludedComponent', () => {
  let component: CardIncludedComponent;
  let fixture: ComponentFixture<CardIncludedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardIncludedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardIncludedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
