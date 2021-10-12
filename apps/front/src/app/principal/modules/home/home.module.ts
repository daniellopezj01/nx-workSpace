import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { ContainerComponent } from './pages/container/container.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TopComponent } from './pages/top/top.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AvatarModule } from 'ngx-avatar';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  declarations: [ContainerComponent, TopComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    TranslateModule,
    IvyCarouselModule,
    SharedModule,
    PerfectScrollbarModule,
    AvatarModule,
  ],
})
// @ts-ignore
export class HomeModule {}
