import { SuccessComponent } from './pages/success/success.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayComponent } from './pages/pay/pay.component';

const routes: Routes = [
  {
    path: 'success',
    component: SuccessComponent,
  },
  {
    path: 'success/:id',
    component: SuccessComponent,
  },
  {
    path: ':id',
    component: PayComponent,
  },
  {
    path: ':operationType/:externalCode',
    component: PayComponent,
  },
  {
    path: '',
    component: PayComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// @ts-ignore
export class PaymentRoutingModule { }
