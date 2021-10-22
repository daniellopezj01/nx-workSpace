import { CanLeaveModule } from './../../can-leave/can-leave.module';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReservationsRoutingModule } from './reservations-routing.module';
import { ListReservationComponent } from './pages/list-reservation/list-reservation.component';
import { SharedModule } from '../shared/shared.module';
import { AddReservationComponent } from './pages/add-reservation/add-reservation.component';
import { DetailsReservationComponent } from './pages/details-reservation/details-reservation.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { FormReservationComponent } from './pages/form-reservation/form-reservation.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AvatarModule } from 'ngx-avatar';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TimeagoModule } from 'ngx-timeago';
import { ErrorTailorModule } from '@ngneat/error-tailor';
import { PassportComponent } from './pages/passport/passport.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [
    ListReservationComponent,
    AddReservationComponent,
    DetailsReservationComponent,
    FormReservationComponent,
    PassportComponent,
  ],
  imports: [
    CommonModule,
    ReservationsRoutingModule,
    SharedModule,
    MatTabsModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    ErrorTailorModule,
    // ErrorTailorModule.forRoot({
    //     errors: {
    //         useValue: {
    //             required: 'This field is required',
    //             minlength: ({requiredLength, actualLength}) =>
    //                 `Expect ${requiredLength} but got ${actualLength}`,
    //             invalidAddress: (error) => `Address isn't valid`,
    //         },
    //     },
    // }),
    AvatarModule,
    NgxMaskModule.forRoot(),
    NgxIntlTelInputModule,
    NgSelectModule,
    TimeagoModule,
  ],
  exports: [ListReservationComponent],
  providers: [DatePipe],
})
export class ReservationsModule { }
