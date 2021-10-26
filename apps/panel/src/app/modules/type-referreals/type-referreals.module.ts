import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { TypeReferrealsRoutingModule } from './type-referreals-routing.module';
import { ListTypeReferrealsComponent } from './pages/list-type-referreals/list-type-referreals.component';
import { FormTypeReferrealsComponent } from './pages/form-type-referreals/form-type-referreals.component';
import { DetailsTypeReferrealsComponent } from './pages/details-type-referreals/details-type-referreals.component';
import { AddTypeReferrealsComponent } from './pages/add-type-referreals/add-type-referreals.component';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AvatarModule } from 'ngx-avatar';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ErrorTailorModule } from '@ngneat/error-tailor';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [
    ListTypeReferrealsComponent,
    FormTypeReferrealsComponent,
    DetailsTypeReferrealsComponent,
    AddTypeReferrealsComponent
  ],
  imports: [
    CommonModule,
    TypeReferrealsRoutingModule,
    SharedModule,
    MatTabsModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AvatarModule,
    NgSelectModule,
    NgxMaskModule.forRoot(),
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
export class TypeReferrealsModule { }
