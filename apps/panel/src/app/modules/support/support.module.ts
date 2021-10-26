import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportRoutingModule } from './support-routing.module';
import { ListSupportComponent } from './pages/list-support/list-support.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { ErrorTailorModule } from '@ngneat/error-tailor';
import { DetailsSupportComponent } from './pages/details-support/details-support.component';
import { ConversationComponent } from './pages/conversation/conversation.component';
import { AvatarModule } from 'ngx-avatar';


@NgModule({
  declarations: [ListSupportComponent, DetailsSupportComponent, ConversationComponent],
  imports: [
    CommonModule,
    SupportRoutingModule,
    SharedModule,
    MatTabsModule,
    TranslateModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    TimeagoModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    NgSelectModule,
    FilePickerModule,
    PerfectScrollbarModule,
    AvatarModule,
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
  ]
})
export class SupportModule { }
