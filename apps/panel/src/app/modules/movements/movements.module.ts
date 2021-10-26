import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovementsRoutingModule } from './movements-routing.module';
import { ListMovementsComponent } from './pages/list-movements/list-movements.component';
import { SharedModule } from '../shared/shared.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { DetailsMovementsComponent } from './pages/details-movements/details-movements.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ErrorTailorModule } from '@ngneat/error-tailor';
import { NgxMaskModule } from 'ngx-mask';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AvatarModule } from 'ngx-avatar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TimeagoModule } from 'ngx-timeago';

@NgModule({
  declarations: [ListMovementsComponent, DetailsMovementsComponent],
  imports: [
    CommonModule,
    MovementsRoutingModule,
    SharedModule,
    TranslateModule,
    FormsModule,
    // NgxEditorModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    MatTabsModule,
    FontAwesomeModule,
    NgxMaskModule.forRoot(),
    NgSelectModule,
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
    AvatarModule,
    TooltipModule,
    TimeagoModule,
  ],
  exports: [ListMovementsComponent],
})
export class MovementsModule { }
