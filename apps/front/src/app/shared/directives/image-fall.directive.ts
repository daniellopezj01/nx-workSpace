import {
  Directive,
  Input,
  ElementRef,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Directive({
  selector: 'img[appImgFallback]',
})
export class ImageFallDirective {
  @Input() appImgFallback: string;

  constructor(
    private eRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId,
    {nativeElement}: ElementRef<HTMLImageElement>
  ) {
    nativeElement.setAttribute('loading', 'lazy');
    nativeElement.style.backgroundColor = '#f5f5f5';
  }

  @HostListener('error')
  loadFallbackOnError() {
    if (isPlatformBrowser(this.platformId)) {
      const element: HTMLImageElement = this.eRef
        .nativeElement as HTMLImageElement;
      element.src =
        this.appImgFallback ||
        `${window.location.origin}/assets/extra/broken-image.png`;
    }
  }
}
