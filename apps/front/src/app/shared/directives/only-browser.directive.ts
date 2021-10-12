import {
  Directive,
  ElementRef,
  Inject,
  Input,
  PLATFORM_ID,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appOnlyBrowser]',
})
export class OnlyBrowserDirective {
  @Input()
  set appOnlyBrowser(val) {
    if (isPlatformBrowser(this.platformId)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Inject(PLATFORM_ID) private platformId
  ) {}
}
