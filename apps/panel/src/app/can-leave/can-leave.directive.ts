import {
  Directive,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CanLeaveService } from './can-leave.service';
import { Observable, of, defer } from 'rxjs';
import { tap, throttleTime, last, first } from 'rxjs/operators';
import { LeaveDialogComponent } from '../modules/shared/leave-dialog/leave-dialog.component';

@Directive({
  selector: 'wm-dialog',
})
export class CanLeaveDirective {
  // constructor(
  //   private canLeave: CanLeaveService,
  //   private dialog: LeaveDialogComponent
  // ) {
  //   // Hooks on the allowDeactivation observer
  //   this.canLeave.allowDeactivation(this.canLeave$);
  // }
  // /** When true, pops-up a dialog asking for user's consent to leave*/
  // @Input() dontLeave: boolean = false;
  // /** Reflects the dontLeave changes */
  // @Output() dontLeaveChange = new EventEmitter<boolean>();
  // // CanLeave Observavble
  // private get canLeave$(): Observable<boolean> {
  //   // Builds an observable conditionally at subscription time
  //   // @ts-ignore
  //   return (
  //     defer(() =>
  //       this.dontLeave ? this.dialog.open().afterClosed() : of(true)
  //     )
  //       // Makes sure all the following requests will be true once the first has been granted
  //       .pipe(
  //         tap(
  //           (granted) =>
  //             granted === this.dontLeave &&
  //             this.dontLeaveChange.emit((this.dontLeave = !granted))
  //         )
  //       )
  //   );
  // }
  // // Prevents the tab/page to be closed
  // @HostListener('window:beforeunload', ['$event']) private beforeUnload(
  //   ev: Event
  // ) {
  //   if (this.dontLeave) {
  //     return false;
  //   }
  // }
}
