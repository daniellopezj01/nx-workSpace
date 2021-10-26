import { Component, OnInit, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { finalize, map, tap } from 'rxjs/operators';
import { WalletService } from './services/wallet.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  private nextPage = false;
  public dataRaw: any;
  public data: any;
  public loading = false;
  public total = 0;
  columns = [
    { key: 'USER.WALLET.KEY_AMOUNT' },
    { key: 'USER.WALLET.KEY_STATUS' },
    { key: 'USER.WALLET.KEY_DESCRIPTION' },
    { key: 'USER.WALLET.KEY_DATE' },
    { key: 'USER.WALLET.KEY_PLATFORM' },
  ];

  constructor(
    private rest: RestService,
    public translate: TranslateService,
    private route: Router,
    public walletService: WalletService,
    public deviceService: DeviceDetectorService,
  ) { }

  ngOnInit(): void {
    this.getData();

  }

  getData(page = 1): any {
    this.walletService.page = page;
    this.loading = true;
    const url = [
      `wallets?limit=${this.walletService.limitPerPage}`,
      `&page=${this.walletService.page}`,
    ];
    this.rest
      .get(url.join(''))
      .pipe(
        finalize(() => (this.loading = false)),
        tap((o) => {
          this.dataRaw = o;
          this.loading = false;
          this.nextPage = o.nextPage;
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
