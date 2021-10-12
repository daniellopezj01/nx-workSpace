import { LoginRegisterComponent } from './pages/login-register/login-register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { PassSendEmailComponent } from './pages/pass-send-email/pass-send-email.component';
import { SuccessChangeComponent } from './pages/success-change/success-change.component';
import { ResetComponent } from './pages/reset/reset.component';
import { CallbackComponent } from './pages/callback/callback.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'login'
  // },
  {
    path: 'login',
    component: LoginRegisterComponent,
  },
  {
    path: 'register',
    component: LoginRegisterComponent,
  },
  {
    path: 'forgot',
    component: ForgotComponent,
  },
  {
    path: 'sendEmail',
    component: PassSendEmailComponent,
  },
  {
    path: 'successChange',
    component: SuccessChangeComponent,
  },
  {
    path: 'reset/:id',
    component: ResetComponent,
  },
  {
    path: 'callback',
    component: CallbackComponent,
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// @ts-ignore
export class AuthRoutingModule {}
