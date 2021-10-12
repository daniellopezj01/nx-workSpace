import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FreeAccountRoutingModule } from './free-account-routing.module';
import { FreeAccountComponent } from './pages/free-account/free-account.component';
import { SharedModule } from '@shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [FreeAccountComponent],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    FreeAccountRoutingModule
  ]
})
export class FreeAccountModule { }
