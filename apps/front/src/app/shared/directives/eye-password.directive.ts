/* eslint-disable @angular-eslint/directive-selector */
import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appEyePassword]',
})
export class EyePasswordDirective {
  constructor(
    private el: ElementRef,
    private render: Renderer2,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.setup();
  }

  setup() {
    if (isPlatformBrowser(this.platformId)) {
      const parent = this.el.nativeElement.parentNode;
      const span = document.createElement('span');
      span.innerHTML = `<div class="small" style="cursor: pointer">Show password</div>`;
      span.addEventListener('click', (event) => {
        const checkType =
          parent.querySelector('input').getAttribute('type') || null;
        if (checkType) {
          this.render.setAttribute(
            this.el.nativeElement,
            'type',
            checkType === 'text' ? 'password' : 'text'
          );
        }
      });
      parent.appendChild(span);
    }
  }
}
