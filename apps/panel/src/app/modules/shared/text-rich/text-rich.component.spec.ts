import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextRichComponent } from './text-rich.component';

describe('TextRichComponent', () => {
  let component: TextRichComponent;
  let fixture: ComponentFixture<TextRichComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextRichComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextRichComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
