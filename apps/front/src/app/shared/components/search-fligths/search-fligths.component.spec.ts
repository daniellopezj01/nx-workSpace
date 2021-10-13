import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFligthsComponent } from './search-fligths.component';

describe('SearchFligthsComponent', () => {
  let component: SearchFligthsComponent;
  let fixture: ComponentFixture<SearchFligthsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchFligthsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFligthsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
