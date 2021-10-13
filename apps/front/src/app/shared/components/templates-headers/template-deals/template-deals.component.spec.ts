import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TemplateDealsComponent } from './template-deals.component';

describe('TemplateDealsComponent', () => {
  let component: TemplateDealsComponent;
  let fixture: ComponentFixture<TemplateDealsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TemplateDealsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
