import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReferralsRoutingModule } from './referrals-routing.module';
import { AddReferredComponent } from './pages/add-referred/add-referred.component';
import { ListReferredComponent } from './pages/list-referred/list-referred.component';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AvatarModule } from 'ngx-avatar';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ErrorTailorModule } from '@ngneat/error-tailor';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormReferredComponent } from './pages/form-referred/form-referred.component';
import { DetailsReferredComponent } from './pages/details-referred/details-referred.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    AddReferredComponent,
    ListReferredComponent,
    FormReferredComponent,
    DetailsReferredComponent,
  ],
  imports: [
    CommonModule,
    ReferralsRoutingModule,
    SharedModule,
    MatTabsModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AvatarModule,
    TooltipModule,
    NgSelectModule,
    PaginationModule.forRoot(),
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
  providers: [DatePipe],
})
export class ReferralsModule { }
