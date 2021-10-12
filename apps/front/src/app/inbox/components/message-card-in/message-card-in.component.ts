import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarDirective,
} from 'ngx-perfect-scrollbar';
import * as _ from 'lodash';
import { MessageInboxService } from '../../services/message-inbox.service';
import { RestService } from '../../../core/services/rest.service';
import { SocketProviderConnect } from '../../../core/socket/web-socket.service';

@Component({
  selector: 'app-message-card-in',
  templateUrl: './message-card-in.component.html',
  styleUrls: ['./message-card-in.component.scss'],
})
export class MessageCardInComponent implements OnInit {
  @Input() data: CardInbox | any = {
    createdAt: '',
    firstMessage: [],
    hash: '',
    members: [],
    messages: [],
    list: [],
    toFrom: [],
    type: '',
    updatedAt: '',
    // tslint:disable-next-line:variable-name
    _id: '',
  };
  private form: FormGroup;
  private user: any;
  public listSubscribers: any = [];
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarDirective, { static: false })
  directiveRef?: PerfectScrollbarDirective;
  loading = false;

  constructor(
    private messageInboxService: MessageInboxService,
    private formBuilder: FormBuilder,
    private rest: RestService,
    private webSocketService: SocketProviderConnect
  ) {

    this.form = this.formBuilder.group({
      to: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(1)]],
      mock: [''],
      _id: [''],
    });
  }

  ngOnInit(): void {
    this.user = this.rest.getCurrentUser();
    this.listObserver();
    // @ts-ignore
    this.form.patchValue({ to: _.head(this.data?.membersOmit)._id, _id: this.data?._id });
  }

  listObserver = () => {
    const observer1$ = this.webSocketService.outEven.subscribe((res) => {
      if (this.data?.hash === res?.payload?.hash) {
        this.data.openBox = true;
        this.data.list = [...this.data.list, ...[res?.payload?.message]];
        this.scrollAnimate();
        this.messageInboxService.playBeep();
      }
    });

    const observer2$ = this.messageInboxService.sendInbox.subscribe((res) => {
      if (res?.res?.hash === this.data?.hash) {
        this.data.list.push(_.head(res?.res?.messages));
      }
    });

    this.listSubscribers = [observer1$, observer2$];
  }

  openBox(i: any) {
    this.data = { ...this.data, ...{ openBox: !i.openBox } };
    this.scrollAnimate();
    // this.data
  }

  scrollAnimate = () => {
    setTimeout(
      () => (this.directiveRef ? this.directiveRef.scrollToBottom() : null),
      150
    );
  }

  saveNewChat(): any {
    if (this.form.valid) {
      this.loading = true;
      this.messageInboxService
        .saveNewChat(this.form.value)
        .then(() => {
          this.form.patchValue({ message: null });
          this.loading = false;
          this.scrollAnimate();
        })
        .catch(() => (this.loading = false));
    }
  }
}

export class CardInbox {
  createdAt: string = '';
  firstMessage: any;
  hash: string = '';
  members: Array<any> = [];
  messages: Array<MessageModel> = [];
  list: Array<MessageModel> = [];
  toFrom: Array<any> = [];
  type: string = '';
  updatedAt: string = '';
  // tslint:disable-next-line:variable-name
  _id: string = '';
}

export class MessageModel {
  message: string = '';
  creator: string = '';
  dateCreate: string = '';
}
