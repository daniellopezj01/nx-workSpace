import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { InboxRoutingModule } from './inbox-routing.module';
import { ChatsComponent } from './pages/chats/chats.component';
import { ConversationsComponent } from './pages/conversations/conversations.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TimeagoModule } from 'ngx-timeago';
import { DetailsComponent } from './pages/details/details.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AvatarModule } from 'ngx-avatar';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';

@NgModule({
  declarations: [
    ChatsComponent,
    ConversationsComponent,
    MessagesComponent,
    DetailsComponent,
  ],
  imports: [
    CommonModule,
    InboxRoutingModule,
    SharedModule,
    TranslateModule,
    TimeagoModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    AutosizeModule,
    PerfectScrollbarModule,
    AvatarModule,
    NgxLinkifyjsModule,
  ],
  providers: [DatePipe],
})
export class InboxModule {}
