import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNotImage]',
})
export class NotImageDirective {
  @Input() urlCustom: string;

  constructor(private elementRef: ElementRef) {}

  @HostListener('error')
  loadImage(): any {
    const element = this.elementRef.nativeElement;
    element.src = this.urlCustom || `${window.location.origin}/aaa-pnmg`;
  }
}
