import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrincipalRoutingModule } from './principal-routing.module';
import { MainComponent } from './main/main.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';


@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    SharedModule,
    PrincipalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    PerfectScrollbarModule,
  ],
})
// @ts-ignore
export class PrincipalModule {}
