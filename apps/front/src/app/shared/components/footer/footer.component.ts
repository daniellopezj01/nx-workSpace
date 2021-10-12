import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  faInstagram,
  faYoutube,
  faFacebook,
  faTwitter,
  faPinterest,
} from '@fortawesome/free-brands-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  // @Input()
  iconsSocial = [
    { icon: faInstagram, href: 'https://www.instagram.com/mochileros.mex' },
    {
      icon: faYoutube,
      href: 'https://www.youtube.com/channel/UClXvORGUGA-V53LcWaJGL2w',
    },
    { icon: faFacebook, href: 'https://www.facebook.com/mochileros.com.mx' },
  ];
  dataLinks: any = [
    {
      title: 'LINKS_EXTERNAL.LEGAL_TITLE',
      data: [
        { key: 'LINKS_EXTERNAL.TERMS_AND_CONDITIONS' },
        { key: 'LINKS_EXTERNAL.PRIVACY_AND_POLICY' },
      ],
    },
    {
      title: 'LINKS_EXTERNAL.COMUNITY_TITLE',
      data: [
        { key: 'LINKS_EXTERNAL.PROGRAM_WALLET' },
        { key: 'LINKS_EXTERNAL.REFERREALS_PROGRAM' }
      ],
    },
    {
      title: 'LINKS_EXTERNAL.WE_TITLE',
      data: [
        { key: 'LINKS_EXTERNAL.ABOUT_US' },
        { key: 'LINKS_EXTERNAL.TRAVEL_STYLES' },
        { key: 'LINKS_EXTERNAL.PHOTOS_AND_VIDEO' },
      ],
    },
    {
      title: 'LINKS_EXTERNAL.GENERAL_TITLE',
      data: [{ key: 'LINKS_EXTERNAL.CONTACT' }, { key: 'LINKS_EXTERNAL.FAQS' }],
    },
  ];

  constructor(
    public service: SharedService,
    public translate: TranslateService,
    private library: FaIconLibrary
  ) {
    library.addIcons(
      faInstagram,
      faYoutube,
      faFacebook,
      faTwitter,
      faPinterest
    );
  }

  ngOnInit(): void {
  }
}
