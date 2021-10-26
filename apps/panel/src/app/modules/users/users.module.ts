import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { ListUserComponent } from './pages/list-user/list-user.component';
import { DetailsUserComponent } from './pages/details-user/details-user.component';
import { SharedModule } from '../shared/shared.module';
import { AvatarModule } from 'ngx-avatar';
import { TimeagoModule } from 'ngx-timeago';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ErrorTailorModule } from '@ngneat/error-tailor';
import { TranslateModule } from '@ngx-translate/core';
import { FormUserComponent } from './pages/form-user/form-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatTabsModule } from '@angular/material/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { WalletComponent } from './pages/wallet/wallet.component';
import { ReferrealsComponent } from './pages/referreals/referreals.component';

@NgModule({
  declarations: [
    AddUserComponent,
    ListUserComponent,
    DetailsUserComponent,
    FormUserComponent,
    WalletComponent,
    ReferrealsComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    AvatarModule,
    MatTabsModule,
    TranslateModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    TimeagoModule,
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    NgSelectModule,
    TagInputModule,
    NgxIntlTelInputModule,
    FilePickerModule,
    ErrorTailorModule.forRoot({
      errors: {
        useValue: {
          required: 'This field is required',
          minlength: ({ requiredLength, actualLength }) =>
            `Expect ${requiredLength} but got ${actualLength}`,
          invalidAddress: (error) => `Address isn't valid`,
        },
      },
    }),
  ],
})
export class UsersModule {}
