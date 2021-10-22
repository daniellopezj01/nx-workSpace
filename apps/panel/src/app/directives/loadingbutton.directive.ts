import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[LoadingbuttonDirective]',
})
export class LoadingbuttonDirective
  implements OnInit, AfterViewInit, OnChanges {
  @Input('LoadingbuttonDirective') loading: any = false;
  @Input() label: string;
  originalInnerText: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Save the original button text so I can restore it when waiting ends
    this.originalInnerText = this.el.nativeElement.innerHTML;
    console.log(this.originalInnerText);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    if (this.loading) {
      this.el.nativeElement.innerHTML = `<span><img src="assets/loading.svg" style="margin-right: 0.5rem;" width="20px" height="20px" alt="">${this.label}</span>`;
    } else {
      if (
        this.el.nativeElement.innerHTML ===
        `<span><img src="assets/loading.svg" style="margin-right: 0.5rem;" width="20px" height="20px" alt="">${this.label}</span>`
      ) {
        this.el.nativeElement.innerHTML = this.originalInnerText;
      }
    }
    // this.el.nativeElement.disabled = this.loading;
  }

  ngAfterViewInit(): void {
    this.originalInnerText = this.el.nativeElement.innerHTML;
    console.log(this.originalInnerText);
  }
}
