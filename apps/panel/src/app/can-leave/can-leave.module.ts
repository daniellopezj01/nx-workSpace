import { NgModule } from '@angular/core';
//import { DialogModule } from '../dialog/dialog.module';
//import { CanLeaveComponent } from './can-leave.component';
import { CanLeaveService } from './can-leave.service';
import { CanLeaveDirective } from './can-leave.directive';

@NgModule({
  declarations: [CanLeaveDirective],
  providers: [CanLeaveService],
  exports: [CanLeaveDirective],
})
export class CanLeaveModule {}
