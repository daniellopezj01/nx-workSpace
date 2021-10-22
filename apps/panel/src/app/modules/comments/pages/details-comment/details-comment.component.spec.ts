import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCommentComponent } from './details-comment.component';

describe('DetailsCommentComponent', () => {
  let component: DetailsCommentComponent;
  let fixture: ComponentFixture<DetailsCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
