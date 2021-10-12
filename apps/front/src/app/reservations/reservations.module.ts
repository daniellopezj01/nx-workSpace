import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReservationsRoutingModule } from './reservations-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { EmergencyComponent } from './pages/emergency/emergency.component';
import { BuyerComponent } from './pages/buyer/buyer.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { ProgressBarModule } from 'angular-progress-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MainReservationComponent } from './pages/main-reservation/main-reservation.component';
import { ErrorTailorModule } from '@ngneat/error-tailor';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContainerSupportComponent } from './pages/support/container-support/container-support.component';
import { ChatsSupportComponent } from './pages/support/chats-support/chats-support.component';
import { MessageSupportComponent } from './pages/support/message-support/message-support.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { AutosizeModule } from 'ngx-autosize';
import { NewMessageComponent } from './modals/new-message/new-message.component';
import { PassportComponent } from './pages/passport/passport.component';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { AvatarModule } from 'ngx-avatar';
import { TourComponent } from './pages/tour/tour.component';
import { TourDetailsModule } from '../tour-details/tour-details.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ImportantInfoComponent } from './pages/important-info/important-info.component';


@NgModule({
  declarations: [
    HomeComponent,
    PersonalInfoComponent,
    EmergencyComponent,
    BuyerComponent,
    TransactionsComponent,
    MainReservationComponent,
    ContainerSupportComponent,
    ChatsSupportComponent,
    MessageSupportComponent,
    NewMessageComponent,
    PassportComponent,
    TourComponent,
    ImportantInfoComponent,
  ],
  imports: [
    CommonModule,
    ReservationsRoutingModule,
    SharedModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TypeaheadModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxIntlTelInputModule,
    ErrorTailorModule,
    ProgressBarModule,
    FontAwesomeModule,
    NgSelectModule,
    PerfectScrollbarModule,
    NgxLinkifyjsModule,
    AutosizeModule,
    FilePickerModule,
    AvatarModule,
    TourDetailsModule,
    AccordionModule,
  ],
  providers: [DatePipe],
})
// @ts-ignore
export class ReservationsModule { }
