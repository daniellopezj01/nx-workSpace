/* eslint-disable @angular-eslint/directive-selector */
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
} from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngxLoading]',
})
export class LoadingBtnDirective implements OnChanges {
  @Input() textLoading?: string;
  @Input() textInitial?: string;
  @Input() disabled = false;
  @Input() loadingFlag: boolean | undefined = undefined;

  constructor(private elem: ElementRef) { }

  ngOnChanges(changes: any): void {
    if (changes?.condition && changes?.condition?.currentValue) {
      const { currentValue } = changes.condition;
      this.loadingFlag = currentValue;
    }
    this.elem.nativeElement.innerText = this.loadingFlag
      ? this.textLoading
      : this.textInitial;

    if ([undefined, false].includes(this.loadingFlag)) {
      this.elem.nativeElement.disabled = !!this.disabled;
    }
  }
}
