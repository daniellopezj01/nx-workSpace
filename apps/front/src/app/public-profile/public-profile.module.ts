import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PublicProfileRoutingModule } from './public-profile-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TimeagoModule } from 'ngx-timeago';
import { AvatarModule } from 'ngx-avatar';
import { ClipboardModule } from '@angular/cdk/clipboard';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    PublicProfileRoutingModule,
    SharedModule,
    TranslateModule,
    FontAwesomeModule,
    TimeagoModule,
    AvatarModule,
    ClipboardModule,
  ],
  providers: [DatePipe],
})
// @ts-ignore
export class PublicProfileModule {}
