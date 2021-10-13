import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PayComponent } from './pages/pay/pay.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';
import { NgxPrettyCheckboxModule } from 'ngx-pretty-checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { SuccessComponent } from './pages/success/success.component';
import { ErrorComponent } from './pages/error/error.component';
@NgModule({
  declarations: [PayComponent, SuccessComponent, ErrorComponent],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    SharedModule,
    TranslateModule,
    NgxMaskModule.forRoot(),
    NgxPrettyCheckboxModule,
    ReactiveFormsModule,
  ],

})
// @ts-ignore
export class PaymentModule { }
