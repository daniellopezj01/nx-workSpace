import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ReferredService } from '../../referred.service';
import { finalize, map, tap } from 'rxjs/operators';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-referred-page',
  templateUrl: './referred-page.component.html',
  styleUrls: ['./referred-page.component.scss'],
})
export class ReferredPageComponent implements OnInit {
  private nextPage = false;
  public dataRaw: any;
  public data: any;
  public loading = false;
  columns = [
    { key: 'REFERRED_LIST.USER_NAME' },
    { key: 'REFERRED_LIST.USER_AMOUNT_TO' },
    { key: 'REFERRED_LIST.USER_AMOUNT_FROM' },
    { key: 'REFERRED_LIST.USER_STATUS' },
  ];

  constructor(
    private rest: RestService,
    public translate: TranslateService,
    public referredService: ReferredService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(page = 1): any {
    this.referredService.page = page;
    this.loading = true;
    const url = [
      `referreds?limit=${this.referredService.limitPerPage}`,
      `&page=${this.referredService.page}`,
    ];
    this.rest
      .get(url.join(''))
      .pipe(
        finalize(() => (this.loading = false)),
        tap((o) => {
          this.dataRaw = o;
          this.loading = false;
          this.nextPage = o.nextPage;
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
