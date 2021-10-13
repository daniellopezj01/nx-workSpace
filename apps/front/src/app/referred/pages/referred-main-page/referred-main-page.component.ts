import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-referred-main-page',
  templateUrl: './referred-main-page.component.html',
  styleUrls: ['./referred-main-page.component.scss'],
})
export class ReferredMainPageComponent implements OnInit {
  // squeareItem: any;
  link: any;
  // private user: any;
  loading = false;
  public currentUser: any;
  public data: any;
  blocks: any[] = [
    {
      id: 'block_1',
      text_one: 'REFERRED_PAGE.BLOCK_1',
      image: 'megaphone.svg',
    },
    {
      id: 'block_2',
      text_one: 'REFERRED_PAGE.BLOCK_2_1_1',
      text_two: 'REFERRED_PAGE.BLOCK_2_1_2',
      image: 'cash.svg',
      params: {},
    },
    {
      id: 'block_3',
      text_one: 'REFERRED_PAGE.BLOCK_3_1_1',
      text_two: 'REFERRED_PAGE.BLOCK_3_1_2',
      image: 'money.svg',
      params: {},
    },
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private rest: RestService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.rest.getCurrentUser();
    if (isPlatformBrowser(this.platformId)) {
      this.link = `${window.location.origin}/auth/register?ref=${this.currentUser?.referredCode}`;
    }

    this.getData();
  }

  showToastClip() {
    this.rest.showToast('COPY_CLIP_BOARD');
  }

  getData() {
    this.loading = true;
    this.rest
      .get(`profile/referred`)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.data = res;
        this.parseData();
      });
  }

  parseData() {
    _.forEach(this.blocks, (i) => {
      if (i?.id === 'block_2') {
        i.params = {
          amount: this.data?.referred?.amountTo || 0,
        };
      }
      if (i?.id === 'block_3') {
        i.params = {
          amount: this.data?.referred?.amountFrom || 0,
        };
      }
    });
  }

  doSomethingOnComplete() {
    console.log('doSomethingOnComplete')
  }
}
