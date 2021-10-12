import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferredRoutingModule } from './referred-routing.module';
import { MainReferredComponent } from './pages/main-referred/main-referred.component';
import { SharedModule } from '../shared/shared.module';
import { ReferredPageComponent } from './pages/referred-page/referred-page.component';
import { ReferredMainPageComponent } from './pages/referred-main-page/referred-main-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CountUpModule } from 'ngx-countup';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


@NgModule({
  declarations: [
    MainReferredComponent,
    ReferredPageComponent,
    ReferredMainPageComponent,
  ],
  imports: [
    CommonModule,
    ReferredRoutingModule,
    SharedModule,
    TranslateModule,
    ClipboardModule,
    CountUpModule,
    PaginationModule,
    FormsModule,
    AvatarModule,
    TooltipModule,
  ],
})
// @ts-ignore
export class ReferredModule {}
