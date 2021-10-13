import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from './core/services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'front';
  status = 'ONLINE';

  constructor(
    private translate: TranslateService,
    private sharedService: SharedService,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.checkLanguage();
    this.sharedService.checkLanguage();
    this.sharedService.changeLanguage.subscribe((res) => {
      translate.setDefaultLang(res?.language);
    });
  }

  checkLanguage(): any {
    if (isPlatformBrowser(this.platformId)) {
      this.cookieService.set(
        'languageSelect',
        JSON.stringify({
          name: 'LANGUAGES.SPANISH',
          language: 'es',
          country: 'es',
        }),
        undefined,
        '/'
      );
      this.translate.setDefaultLang('es');
    } else {
      this.translate.setDefaultLang('es');
    }
  }
}
