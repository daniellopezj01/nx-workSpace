import { NgxStarsModule } from 'ngx-stars';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CreateReservationRoutingModule } from './create-reservation-routing.module';
import { MainCreateReservationComponent } from './pages/main-create-reservation/main-create-reservation.component';
import { SharedModule } from '../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TripSumaryComponent } from './pages/trip-sumary/trip-sumary.component';
import { FormReservationComponent } from './pages/form-reservation/form-reservation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ErrorTailorModule } from '@ngneat/error-tailor';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuestionsComponent } from './pages/questions/questions.component';
import { SignatureComponent } from './pages/signature/signature.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPrettyCheckboxModule } from 'ngx-pretty-checkbox';
import { SignaturePadModule } from 'angular2-signaturepad';
import { AgentsComponent } from './pages/agents/agents.component';

@NgModule({
  declarations: [
    MainCreateReservationComponent,
    TripSumaryComponent,
    FormReservationComponent,
    QuestionsComponent,
    SignatureComponent,
    AgentsComponent,
  ],
  imports: [
    CommonModule,
    CreateReservationRoutingModule,
    SharedModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStarsModule,
    TranslateModule,
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    NgxIntlTelInputModule,
    ErrorTailorModule,
    NgSelectModule,
    NgxPrettyCheckboxModule,
    SignaturePadModule,
  ],
  providers: [DatePipe],
})
export class CreateReservationModule {}
