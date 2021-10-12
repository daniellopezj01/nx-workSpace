import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerSupportComponent } from './container-support.component';

describe('ContainerSupportComponent', () => {
  let component: ContainerSupportComponent;
  let fixture: ComponentFixture<ContainerSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContainerSupportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
