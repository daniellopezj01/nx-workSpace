import { RestService } from './../../../../services/rest/rest.service';
import { Component, OnInit, HostListener, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { finalize, map, tap } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { WalletService } from './wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  @Input() id: any;
  public data: any;
  public dataRaw: any;
  public total = 0;
  public loading = false;
  public faCheckCircle = faCheckCircle;

  public columns = [
    { key: 'USER.WALLET.KEY_CODE' },
    { key: 'USER.WALLET.KEY_STATUS' },
    { key: 'USER.WALLET.KEY_DESCRIPTION' },
    { key: 'USER.WALLET.KEY_DATE' },
    { key: 'USER.WALLET.KEY_PLATFORM' },
    { key: 'USER.WALLET.KEY_AMOUNT' },
  ];

  constructor(
    private activeRouter: ActivatedRoute,
    private rest: RestService,
    private library: FaIconLibrary,
    public translate: TranslateService,
    private router: Router,
    public walletService: WalletService,
    public deviceService: DeviceDetectorService,
  ) {
    library.addIcons(faCheckCircle);
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(page = 1): any {
    this.walletService.page = page;
    this.loading = true;
    const url = [
      `users/payment/${this.id}?limit=${this.walletService.limitPerPage}`,
      `&page=${this.walletService.page}`,
    ];
    this.rest
      .get(url.join(''))
      .pipe(
        finalize(() => (this.loading = false)),
        tap((o) => {
          this.dataRaw = o;
          this.loading = false;
          this.total = o.total;
        }),
        map((b) => b.docs)
      )
      .subscribe((res: any) => {
        this.data = res;
      });
  }

  pageChanged($event: PageChangedEvent) {
    this.getData($event.page);
  }
}
