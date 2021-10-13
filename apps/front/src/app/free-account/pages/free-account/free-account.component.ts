import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-free-account',
  templateUrl: './free-account.component.html',
  styleUrls: ['./free-account.component.scss']
})
export class FreeAccountComponent implements OnInit {
  cards = [
    {
      id: 1,
      title: 'USER.TRIPS.TITLE_TRIPS',
      description: 'USER.TRIPS.DESC_TRIPS',
      icon: 'logo-trips.svg',
      route: ['/', 'user', 'trips'],
      disable: false,
    },
    {
      id: 1,
      title: 'USER.WALLET.TITLE_WALLET',
      description: 'USER.WALLET.DESC_WALLET',
      icon: 'logo-wallet.svg',
      route: ['/', 'user', 'wallet'],
      disable: false,
    },
    {
      id: 1,
      title: 'USER.PERSONAL_INFO.TITLE_PERSON_INFO',
      description: 'USER.PERSONAL_INFO.DESC_PERSON_INFO',
      icon: 'logo-personal-info.svg',
      route: ['/', 'user', 'personal-info'],
      disable: false,
    },
    {
      id: 2,
      title: 'USER.MEDIA.TITLE_MEDIA',
      description: 'USER.MEDIA.DESC_MEDIA',
      icon: 'logo-media.svg',
      route: ['/', 'user', 'media'],
      disable: false,
    },
    {
      id: 3,
      title: 'USER.SECURITY.TITLE_SECURITY',
      description: 'USER.SECURITY.DESC_SECURITY',
      icon: 'logo-security.svg',
      route: ['/', 'user', 'security'],
      disable: false,
    },
    // {
    //   id: 4,
    //   title: 'USER.TITLE_MESSAGE',
    //   description: 'USER.DESC_MESSAGE',
    //   icon: 'logo-messages.svg',
    //   route: ['/', 'inbox'],
    //   disable: false
    // },
    {
      id: 5,
      title: 'USER.TITLE_REFERRALS',
      description: 'USER.DESC_REFERRALS',
      icon: 'logo-referrals.svg',
      route: ['/', 'referred'],
      disable: false,
    },
    // {
    //   id: 5,
    //   title: 'USER.AGENCY.TITLE',
    //   description: 'USER.DESC_REFERRALS',
    //   icon: 'logo-referrals.svg',
    //   route: ['/', 'user', 'agency-link'],
    //   disable: false,
    // },
  ];

  public user: any;
  public loading?: boolean = true;

  constructor(
    private router: Router,
    private cookies: CookieService,
    private rest: RestService,
    public deviceService: DeviceDetectorService,
  ) {

  }

  ngOnInit(): void {
    if (this.rest.getCurrentUser()) {
      this.router.navigate(['user'])
    } else {
      this.loading = false
    }
  }

  goto(str: string) {
    if (str === 'inbox') {
      this.router.navigate([`/auth`]);
    } else {
      this.router.navigate([`/user/${str}`]);
    }
  }

  goToLogin() {
    this.router.navigate([`/auth`]);
  }
}
