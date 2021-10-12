import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { AccountComponent } from './pages/account/account.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SecurityComponent } from './pages/security/security.component';
import { MediaComponent } from './pages/media/media.component';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { LottieModule } from 'ngx-lottie';
import { TripsComponent } from './pages/trips/trips.component';
import { WalletComponent } from './pages/wallet/wallet.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DetailsReservationComponent } from './pages/details-reservation/details-reservation.component';
import { MainProfileComponent } from './pages/main-profile/main-profile.component';
import { AvatarModule } from 'ngx-avatar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ModalCropComponent } from './modal/modal-crop/modal-crop.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CountdownModule } from 'ngx-countdown';
import { ErrorTailorModule } from '@ngneat/error-tailor';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgencyComponent } from './pages/agency/agency.component';
import { AgencyCallbackComponent } from './pages/agency-callback/agency-callback.component';


@NgModule({
  declarations: [
    AccountComponent,
    NotificationsComponent,
    PersonalInfoComponent,
    SecurityComponent,
    MediaComponent,
    TripsComponent,
    WalletComponent,
    DetailsReservationComponent,
    MainProfileComponent,
    ModalCropComponent,
    AgencyComponent,
    AgencyCallbackComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    TypeaheadModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxIntlTelInputModule,
    FilePickerModule,
    LottieModule,
    NgxDatatableModule,
    AvatarModule,
    ErrorTailorModule,
    TooltipModule,
    InfiniteScrollModule,
    PaginationModule,
    NgxSliderModule,
    CountdownModule,
    NgSelectModule,
  ],
  providers: [DatePipe, CurrencyPipe],
})
// @ts-ignore
export class ProfileModule {}
