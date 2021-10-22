import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LottieModule } from 'ngx-lottie';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from '../shared/shared.module';
import { RecoverComponent } from './pages/recover/recover.component';
import { ResetComponent } from './pages/reset/reset.component';
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RecoverComponent,
    ResetComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    LottieModule,
    TranslateModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxMaskModule.forRoot(),
  ],
})
export class AuthModule {}
