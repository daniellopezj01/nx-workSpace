import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContainerBlogComponent } from './container-blog.component';

describe('ContainerBlogsComponent', () => {
  let component: ContainerBlogComponent;
  let fixture: ComponentFixture<ContainerBlogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContainerBlogComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
