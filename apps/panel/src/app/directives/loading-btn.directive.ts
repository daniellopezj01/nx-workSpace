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
export class LoadingBtnDirective implements OnInit, OnChanges {
  @Input() textLoading: string;
  @Input() textInitial: string;
  @Input() disabled: boolean;
  @Input() loadingFlag: boolean | undefined = undefined;

  constructor(private elem: ElementRef) {}

  ngOnInit(): void {}

  ngOnChanges(changes): void {
    if (changes.condition && changes.condition.currentValue) {
      this.loadingFlag = changes.condition.currentValue;
    }
    this.elem.nativeElement.innerText = this.loadingFlag
      ? this.textLoading
      : this.textInitial;

    if (![undefined].includes(this.loadingFlag)) {
      this.elem.nativeElement.disabled = this.loadingFlag
        ? this.loadingFlag
        : !!this.disabled;
    }
  }
}
