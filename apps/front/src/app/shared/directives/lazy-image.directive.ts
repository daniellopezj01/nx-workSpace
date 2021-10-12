import {AfterViewInit, Directive, ElementRef, HostBinding, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appLazyImage]'
})
export class LazyImageDirective implements AfterViewInit {


  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.renderer.addClass(this.el.nativeElement, 'image-blur');
  }

  ngAfterViewInit() {
    this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
  }

  canLazyLoad(): boolean {
    return window && 'IntersectionObserver' in window;
  }

  private lazyLoadImage() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(({isIntersecting}) => {
        if (isIntersecting) {
          this.loadImage();
          obs.unobserve(this.el.nativeElement);
        }
      });
    });
    obs.observe(this.el.nativeElement);
  }

  private loadImage() {
    this.el.nativeElement.src = this.el.nativeElement.dataset.src;
    this.renderer.removeClass(this.el.nativeElement, 'image-blur');
  }

}
