import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  faArrowLeft,
  faLongArrowAltLeft,
} from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Subscription, throwError } from 'rxjs';
import { MessageInboxService } from '../../services/message-inbox.service';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('scrollMe', { static: false })
  componentRef?: PerfectScrollbarComponent | undefined;
  loading: boolean = false;
  public listSubscribers: any = [];
  private currentData: Date = new Date();
  user: any;
  message: any;
  dataMessages: any;
  sendForm: FormGroup;
  disabled = false;
  hash: string = '';
  private dataRaw: any;

  constructor(
    private cookies: CookieService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private active: ActivatedRoute,
    private messageInboxService: MessageInboxService,
    public datePipe: DatePipe,
    private library: FaIconLibrary,
    private formBuilder: FormBuilder,
    private rest: RestService
  ) {
    library.addIcons(faArrowLeft, faLongArrowAltLeft);
    this.sendForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.user = this.rest.getCurrentUser();
    this.listObserver();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
    this.cdRef.detectChanges();
  }

  public scrollToBottom(): void {
    this.componentRef?.directiveRef?.scrollToBottom();
  }

  get f() {
    return this.sendForm.controls.areaMessage;
  }

  checkMessage = (creator: any) => this.user._id === creator;


  send() {
    this.loading = true;
    this.rest
      .post(`messages/${this.hash}`, { message: this.sendForm.value.message })
      .pipe(
        tap(() => (this.loading = false)),
        catchError((err) => {
          this.loading = err;
          return throwError(err);
        })
      )
      .subscribe((res) => {
        this.sendForm.reset();
        this.dataMessages.messages.push(_.head(res.messages));
      });
  }

  getMessages(hash: any) {
    this.loading = true;
    const url = [
      `conversations/${hash}`,
      `?from=${this.messageInboxService.fromMessage}`,
      `&to=${this.messageInboxService.toMessage}`,
    ];
    this.rest
      .get(url.join(''))
      .pipe(
        finalize(() => (this.loading = false)),
        tap((a) => (this.dataRaw = a))
      )
      .subscribe((res) => {
        this.dataMessages = res;
      });
  }

  showDate(param: any) {
    const data = moment(param).toDate();
    if (
      data.getDay() === this.currentData.getDay() &&
      data.getMonth() === this.currentData.getMonth()
    ) {
      this.currentData = data;
      return false;
    } else {
      this.currentData = data;
      return true;
    }
  }

  listObserver = () => {
    const observer1$ = this.active.params.subscribe((params) => {
      const { hash = 'chats' } = params;
      if (hash !== 'chats') {
        this.hash = hash;
        this.getMessages(hash);
      }
    });
    this.listSubscribers.push(observer1$);
  }

  ngOnDestroy() {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }
}
