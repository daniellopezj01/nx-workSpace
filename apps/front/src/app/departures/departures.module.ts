import { NgxStarsModule } from 'ngx-stars';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MainDeparturesComponent } from './pages/main-departures/main-departures.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DeparturesRoutingModule } from './departures-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CardDepartureComponent } from './pages/card-departure/card-departure.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPrettyCheckboxModule } from 'ngx-pretty-checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { StepTwoComponent } from './pages/step-two/step-two.component';
import { CallLoginComponent } from './pages/call-login/call-login.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  declarations: [
    MainDeparturesComponent,
    CardDepartureComponent,
    StepTwoComponent,
    CallLoginComponent,
  ],
  imports: [
    CommonModule,
    DeparturesRoutingModule,
    SharedModule,
    FontAwesomeModule,
    NgxStarsModule,
    TranslateModule,
    NgxPrettyCheckboxModule,
    MatTabsModule,
    PaginationModule,
  ],
  providers: [DatePipe],
})
export class DeparturesModule { }
