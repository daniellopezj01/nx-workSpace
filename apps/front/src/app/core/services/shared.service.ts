import { EventEmitter, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  changeCurrency = new EventEmitter<any>();
  focusMainInput = new EventEmitter<any>();
  changeLanguage = new EventEmitter<any>();
  changeMainInput = new EventEmitter<any>();
  changeInputFlight = new EventEmitter<any>();
  showCloseItem = new EventEmitter<any>();
  dataContinents = new EventEmitter<any>();
  dataTourFilters = new EventEmitter<any>();
  dataCategories = new EventEmitter<any>();
  completedQuestions = new EventEmitter<any>();
  loadSignature = new EventEmitter<any>();
  loadDataHeaders = new EventEmitter<any>();

  protected footer = true;
  protected header = true;
  public accountMenu = [{
    title: 'HEADER.MY_ACCOUNT',
    icon: 'uil-user-square',
    key: 'account',
    activeMargin: true,
    hideTextInSmall: true,
    childs: [
      {
        title: 'HEADER.SOCIAL_PROFILE',
        icon: 'uil-user-square',
        link: 'https://club.mochileros.com.mx/perfil/'
      },
      {
        title: 'HEADER.MY_ACCOUNT',
        icon: 'uil-bars',
        route: '/user'
      },

      {
        title: 'HEADER.MY_TRIPS',
        icon: 'uil-telegram-alt',
        route: '/user/trips'
      },
      {
        title: 'HEADER.WALLET',
        icon: 'uil-wallet',
        route: '/user/wallet'

      },
      {
        title: 'HEADER.MEMBERSHIP',
        icon: 'uil-award',
        link: 'https://club.mochileros.com.mx/cuenta-premium/'

      },
      {
        title: 'HEADER.REFFEREDS',
        icon: 'uil-dollar-alt',
        link: '/referred'
      },
      {
        title: 'MENU.LOG_OUT',
        icon: 'uil-signout',
        link: '/referred',
        logginRequired: true,
        action: () => this.rest.logOut()
        // action: () => { console.log('hola') }
      },
    ]
  }]
  public currencies$?: Observable<any>;
  public languages$?: Observable<any>;
  public numberPhones: any = [
    { name: '+52 55 4166 5533', code: 'mx', value: '+525541665533' },
    { name: '+57 1 5086785', code: 'co', value: '+3715086785' },
    { name: '+1 315 203 3243', code: 'us', value: '+13152033243' },
  ];
  public continents: any = [];
  public categories: any = [];
  public toursFilters: any = [];
  public loadCategories?: boolean;
  public loadContinents?: boolean;
  public loadFilters?: boolean;
  private currentNumber = _.head(this.numberPhones);

  constructor(
    private translate: TranslateService,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: any,
    private rest: RestService
  ) {
    this.preload();
  }

  preload() {
    this.languages$ = of([
      {
        name: 'LANGUAGES.ENGLISH',
        language: 'en',
        country: 'us',
      },
      {
        name: 'LANGUAGES.SPANISH',
        language: 'es',
        country: 'es',
      },
    ]);
    this.getContinents();
    this.getCategories();
    this.getFilters();
  }

  public get getcurrentNumber(): any {
    return this.currentNumber;
  }

  public set setCurrentNumber(num: any) {
    this.currentNumber = num;
  }

  getContinents() {
    if (!this.continents?.length || this.loadContinents) {
      this.loadContinents = true;
      this.rest.get('tours/forContinents').subscribe((res) => {
        this.continents = res;
        this.dataContinents.emit(res);
        this.loadContinents = false;
      });
    } else {
      this.dataContinents.emit(this.continents);
    }
  }

  getFilters() {
    if (!this.toursFilters?.length || this.loadFilters) {
      this.loadFilters = true;
      this.rest.get('tours/getFilters').subscribe((res) => {
        this.toursFilters = res
        this.dataTourFilters.emit(res);
        this.loadFilters = false;
      })
    } else {
      this.dataTourFilters.emit(this.toursFilters);
    }
  }

  getCurrencies(): any {
    try {
      if (isPlatformBrowser(this.platformId)) {
        const currencies = this.cookieService.get('currencies');
        const list = JSON.parse(currencies);
        this.currencies$ = of(list);
      }
    } catch (e) {
      this.currencies$ = of([]);
    }
  }

  setCurrency(value: any): any {
    this.cookieService.set(
      'currencySelect',
      JSON.stringify(value),
      environment.currenciesExpire,
      '/'
    );
    this.changeCurrency.emit(value);
  }

  getCurrencySelect(): any {
    try {
      if (isPlatformBrowser(this.platformId)) {
        let currency: any = this.cookieService.get('currencySelect');
        if (!currency) {
          this.currencies$?.subscribe((res) => {
            this.setCurrency(_.head(res));
          });
        }
        currency = JSON.parse(currency);
        return currency;
      } else {
        return { name: 'USD', value: 1, currency: 'US' };
      }
    } catch (e) {
      return null;
    }
  }

  getCategories() {
    if (!this.categories?.length || this.loadCategories) {
      this.loadCategories = true;
      this.rest.get('categories?limit=100').subscribe((res) => {
        const { docs } = res;
        this.categories = docs;
        this.dataCategories.emit(docs);
        this.loadCategories = false;
      });
    } else {
      this.dataCategories.emit(this.categories);
    }
  }

  getLanguageSelect(): any {
    try {
      if (isPlatformBrowser(this.platformId)) {
        let lenguage: any = this.cookieService.get('languageSelect');
        if (!lenguage) {
          this.languages$?.subscribe((res) => {
            this.setLanguage(_.head(res));

          });
        }
        lenguage = JSON.parse(lenguage);
        return lenguage;
      } else {
        return { name: 'LANGUAGES.SPANISH', language: 'es', country: 'es' };
      }
    } catch (e) {
      return null;
    }
  }

  setLanguage(value: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.cookieService.set('languageSelect', JSON.stringify(value), 300, '/');
      this.changeLanguage.emit(value);
    }
  }

  checkLanguage(): any {
    try {
      if (isPlatformBrowser(this.platformId)) {
        const language =
          JSON.parse(this.cookieService.get('languageSelect')) || null;
        this.changeLanguage.emit(language);
        console.log('--->', language);
      } else {
        this.translate.setDefaultLang('es');
      }
    } catch (e) {
      this.translate.setDefaultLang('es');
      console.log('E', e);
    }
  }
}
