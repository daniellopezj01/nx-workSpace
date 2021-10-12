import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  HostListener,
} from '@angular/core';
import { SharedService } from '../../core/services/shared.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[clickOutside]',
})
export class HighlightDirective {
  // tslint:disable-next-line:no-output-rename
  @Output('clickOutside') clickOutside: EventEmitter<any> = new EventEmitter();

  @HostListener('document:click', ['$event.target']) onMouseEnter(
    targetElement
  ) {
    const id = targetElement.id;
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      let emit = null
      if (['inputMainSearch', 'notLoggin'].includes(id)) {
        emit = id
      }
      if (['idInputFrom', 'idInputTo'].includes(id)) {
        this.shared.changeInputFlight.emit(id)
      } else {
        this.shared.changeInputFlight.emit(null)
      }
      this.clickOutside.emit(emit);
    }
  }
  constructor(private elementRef: ElementRef, private shared: SharedService) { }
}
