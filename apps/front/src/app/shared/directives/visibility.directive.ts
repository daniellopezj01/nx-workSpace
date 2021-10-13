/* eslint-disable @angular-eslint/directive-selector */
import { Directive, TemplateRef, ViewContainerRef, Input, ElementRef } from '@angular/core';
import { take, filter, tap } from 'rxjs/operators';
import { VisibilityService } from '../../core/services/visibility.service';


@Directive({ selector: '[appVisibility]' })
export class VisibilityDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private visibilityService: VisibilityService) {
  }

  @Input()
  set appVisibility(element: any) {
    this.visibilityService
      .elementInSight(new ElementRef(element))
      .pipe(filter(visible => visible), take(1))
      .subscribe(() => {
        this.viewContainer.createEmbeddedView(this.templateRef);
      });
  }

}
