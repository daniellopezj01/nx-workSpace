import { AvatarModule } from 'ngx-avatar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginRegisterComponent } from './pages/login-register/login-register.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { PassSendEmailComponent } from './pages/pass-send-email/pass-send-email.component';
import { ResetComponent } from './pages/reset/reset.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SuccessChangeComponent } from './pages/success-change/success-change.component';
import { ErrorTailorModule } from '@ngneat/error-tailor';
import { CallbackComponent } from './pages/callback/callback.component';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';

@NgModule({
  declarations: [
    LoginRegisterComponent,
    ForgotComponent,
    PassSendEmailComponent,
    ResetComponent,
    SuccessChangeComponent,
    CallbackComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    PasswordStrengthMeterModule,
    ErrorTailorModule,
    AvatarModule
  ],
})

// @ts-ignore
export class AuthModule { }
