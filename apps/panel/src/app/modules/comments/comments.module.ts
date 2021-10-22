import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CommentsRoutingModule } from './comments-routing.module';
import { ListCommentsComponent } from './pages/list-comments/list-comments.component';
import { AddCommentComponent } from './pages/add-comment/add-comment.component';
import { FormCommentComponent } from './pages/form-comment/form-comment.component';
import { DetailsCommentComponent } from './pages/details-comment/details-comment.component';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AvatarModule } from 'ngx-avatar';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ErrorTailorModule } from '@ngneat/error-tailor';
import { NgxStarsModule } from 'ngx-stars';


@NgModule({
  declarations: [
    ListCommentsComponent,
    AddCommentComponent,
    FormCommentComponent,
    DetailsCommentComponent
  ],
  imports: [
    CommonModule,
    CommentsRoutingModule,
    SharedModule,
    MatTabsModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AvatarModule,
    NgxStarsModule,
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
export class CommentsModule { }
