import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TemplateDestinationsComponent } from './template-destinations.component';

describe('TemplateDestinationsComponent', () => {
  let component: TemplateDestinationsComponent;
  let fixture: ComponentFixture<TemplateDestinationsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TemplateDestinationsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
