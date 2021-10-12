/* eslint-disable @angular-eslint/directive-selector */
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngxLoading]',
})
export class LoadingBtnDirective implements OnChanges {
  @Input() textLoading?: string;
  @Input() textInitial?: string;
  @Input() disabled?: boolean;
  @Input() loadingFlag = false;

  constructor(private elem: ElementRef) { }


  ngOnChanges(changes: any): void {
    if (changes?.condition && changes?.condition?.currentValue) {
      const { currentValue } = changes.condition;
      this.loadingFlag = currentValue;
    }
    this.elem.nativeElement.innerText = this.loadingFlag
      ? this.textLoading
      : this.textInitial;
    if (![!!undefined].includes(this.loadingFlag)) {
      this.elem.nativeElement.disabled = !!this.disabled;
    }
  }
}
