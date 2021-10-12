import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FreeAccountRoutingModule } from './free-account-routing.module';
import { FreeAccountComponent } from './pages/free-account/free-account.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';


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
