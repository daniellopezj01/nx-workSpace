import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { finalize, map, tap } from 'rxjs/operators';
import { ManagerService } from '../../services/manager.service';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss'],
})
export class ConversationsComponent implements OnInit {
  public loading: boolean = false;
  public data: any;
  @Output() selectChat = new EventEmitter<any>();
  @Output() componentActive = new EventEmitter<any>();
  @Input() hash: any = [];
  public chatActive: number = -1;
  dataRaw: any;

  constructor(
    private rest: RestService,
    public translate: TranslateService,
    private manager: ManagerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.callChats();
  }

  callChats() {
    this.loading = true;
    this.rest
      .get('/conversations')
      .pipe(
        finalize(() => (this.loading = false)),
        tap((a) => (this.dataRaw = a)),
        map((b: any) => b.docs)
      )
      .subscribe((res: any) => {
        this.data = res;
      });
  }

  showMessage(item: any, i: any) {
    this.loadHashUrl(item.hash);
    this.manager.showMessage();
    this.chatActive = i;
  }

  loadHashUrl(hash: string) {
    this.hash = hash;
    this.router.navigate(['/', 'inbox', hash]);
  }
}
