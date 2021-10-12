import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { finalize, map } from 'rxjs/operators';
import * as moment from 'moment';
import * as _ from 'lodash';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarDirective,
} from 'ngx-perfect-scrollbar';
import { MessageInboxService } from '../../services/message-inbox.service';
import { RestService } from '../../../core/services/rest.service';
import { SocketProviderConnect } from '../../../core/socket/web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-inbox',
  templateUrl: './message-inbox.component.html',
  styleUrls: ['./message-inbox.component.scss'],
})
export class MessageInboxComponent implements OnInit, OnDestroy {
  constructor(
    private rest: RestService,
    private messageInboxService: MessageInboxService,
    private webSocketService: SocketProviderConnect
  ) { }

  public loading: boolean = false;
  public user: any;
  public listSubscribers: any = [];

  public inbox: Array<any> = [];

  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarDirective, { static: false })
  directiveRef?: PerfectScrollbarDirective | undefined;

  ngOnInit(): void {
    this.user = this.rest.getCurrentUser();
    if (this.user) {
      this.loadData();
      this.listObserver();
    }
  }

  ngOnDestroy() {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }

  listObserver = () => {
    const observer1$ = this.messageInboxService.newTap.subscribe((res) => {
      const match = _.find(this.inbox, (o) => {
        return _.find(o.membersOmit, { _id: res?._id });
      });
      if (!match) {
        this.inbox = [
          {
            mock: true,
            list: [],
            members: [res, this.user],
            membersOmit: [res],
            messages: [],
            openBox: true,
            _id: moment().unix(),
          },
          ...this.inbox,
        ];
      } else {
        _.forEach(this.inbox, (p) => {
          p.openBox = p?._id === match?._id;
          return p;
        });
      }
    });

    const observer2$ = this.messageInboxService.sendInbox.subscribe((res) => {
      // if (res?._id?.length) {
      //   _.forEach(this.inbox, (o) => {
      //     if (res?.res?._id === o?._id) {
      //       console.log('D', o.list)
      //       console.log('D1', _.head(res?.res?.messages))
      //       console.log('D2', _.head(res?.res?.messages))
      //       o.list.push(_.head(res?.res?.messages));
      //       console.log(o.list)
      //     }
      //     return o;
      //   });
      // }
      //
      // if (!res?._id?.length) {
      //   _.forEach(this.inbox, (o) => {
      //     if (res?._id === o?._id) {
      //       o.list.push(_.head(res?.res?.messages));
      //     }
      //     return o;
      //   });
      // }
    });

    const observer3$ = this.webSocketService.outEven.subscribe((res) => {
      if (!_.find(this.inbox, { hash: res?.payload?.hash })) {
        const firstMessage = this.messageInboxService.firstConversation(
          res?.payload,
          this.user
        );
        this.inbox = [...[firstMessage]];
      }
    });

    this.listSubscribers = [observer1$, observer2$, observer3$];
  }

  openBox(index: any): any {
    this.inbox[index].openBox = !this.inbox[index].openBox;
    setTimeout(() => this.directiveRef?.scrollToBottom(), 150);
  }

  loadData(page = 1, config: any = {}): any {
    this.loading = true;
    this.rest
      .get(`conversations?page=${page}`)
      .pipe(
        finalize(() => (this.loading = false)),
        map((a) => a.docs)
      )
      .subscribe((res) => {
        _.forEach(res, (o) => {
          o.membersOmit = _.filter(o.members, (p) => {
            return p._id !== this.user?._id;
          });
          o.openBox = o?._id === config?.open;
          o.list = _.reverse(o.messages);
          return o;
        });
        this.inbox = [...res];
      });
  }
}
