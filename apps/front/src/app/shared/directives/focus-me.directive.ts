import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appFocusMe]',
})
export class FocusMeDirective implements AfterViewInit {
  constructor(private host: ElementRef) {}

  ngAfterViewInit() {
    this.host.nativeElement.focus();
  }
}
