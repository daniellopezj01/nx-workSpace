import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardFeaturedComponent } from './card-featured.component';

describe('CardFeaturedComponent', () => {
  let component: CardFeaturedComponent;
  let fixture: ComponentFixture<CardFeaturedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardFeaturedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardFeaturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
