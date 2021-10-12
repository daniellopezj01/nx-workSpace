import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ManagerService} from '../../services/manager.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit, OnDestroy {
  constructor(
    private active: ActivatedRoute,
    public manager: ManagerService
  ) {}
  public listSubscribers: any = [];
  public hash = '';
  loading: boolean;
  openConversation: boolean;

  ngOnInit(): void {
    this.listObserver();
  }

  listObserver = () => {
    const observer1$ = this.active.params.subscribe((params) => {
      const { hash = 'chats' } = params;
      this.openConversation = hash === 'chats';
      this.hash = hash;
    });
    this.listSubscribers.push(observer1$);
  }

  goChat($event) {
    // this.getMessages($event);
  }

  ngOnDestroy() {
    this.listSubscribers.forEach((a) => a.unsubscribe());
  }
}
