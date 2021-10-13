import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerFeaturedComponent } from './container-featured.component';

describe('ContainerFeaturedComponent', () => {
  let component: ContainerFeaturedComponent;
  let fixture: ComponentFixture<ContainerFeaturedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContainerFeaturedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerFeaturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
