import { Subscription } from 'rxjs';
import { InputSearchService } from './../input-search/input-search.service';
import { ToursService } from './../../../search/pages/tours/services/tours.service';
import { MainSearchService } from './../../../search/pages/main-search.service';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  OnDestroy,
  AfterContentChecked,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from '../../../core/services/rest.service';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy, AfterContentChecked {
  @ViewChild('inputSearch') inputsearch: ElementRef | undefined;
  @Input() shadow = true;
  public listSubscribers: any = [];
  public isActive = 0;
  public sendForm: FormGroup;
  public data: any;
  public accountMenu: any = []
  public accountMenuActive = false
  public structureHeader = [
    {
      title: 'HEADER.TOURS',
      icon: 'uil-globe',
      key: 'tours',
      childs: [
        {
          title: 'HEADER.ALL_TOURS',
          key: 'all',
          route: 'search/tours'
        },
        {
          title: 'HEADER.DESTINATIONS',
          keyParams: 'continent',
          keyResponse: 'continents',
        },
        {
          title: 'HEADER.LANGUAGE',
          keyParams: 'language',
          keyResponse: 'languages'
        },
        {
          title: 'HEADER.WAY_TRAVEL',
          keyParams: 'category',
          keyResponse: 'categories'
        },
        {
          title: 'HEADER.DURATION',
          keyParams: 'duration',
          keyResponse: 'duration'
        },
      ]
    },
    {
      title: 'HEADER.HOTELS',
      icon: 'uil-building',
      link: 'https://destinos.mochileros.com.mx/hoteles/'
    },
    {
      title: 'HEADER.FLIGHTS',
      icon: ' uil-telegram-alt',
      link: 'https://reservar.mochileros.com.mx/?s=2#2'
    },
    {
      title: 'HEADER.MORE',
      icon: 'uil-bus-alt',
      key: 'tours',
      childs: [
        {
          title: 'HEADER.TRAINS',
          icon: 'uil-subway',
          link: 'https://destinos.mochileros.com.mx/reservar-trenes-de-europa/'
        },
        {
          title: 'HEADER.BUS',
          icon: 'uil-bus-alt',
          link: 'https://destinos.mochileros.com.mx/boletos-de-autobus-en-linea/',

        },
        {
          title: 'HEADER.ACTIVITIES_DESTINATION',
          icon: 'uil-map-pin-alt',
          link: 'https://www.viator.com/es-MX/?localeSwitch=1&pid=P00051794&mcid=42383&medium=link'
        },
        {
          title: 'HEADER.TRAVEL_INSURANCE',
          icon: 'uil-heartbeat',
          link: 'https://www.assistcard.com/mx/b2c/mochileros'
        },
      ]
    },
    {
      title: 'HEADER.COMUNITY',
      icon: 'uil-users-alt',
      defaultActive: true,
      link: 'https://club.mochileros.com.mx/',
      childs: [
        {
          title: 'HEADER.CURRENT_ACTIVITY',
          icon: 'uil-airplay',
          link: 'https://club.mochileros.com.mx/',
        },
        {
          title: 'MENU.PROFILE',
          icon: 'uil-user',
          link: 'https://club.mochileros.com.mx/perfil/',
        },
        {
          title: 'HEADER.TRAVELER_MAP',
          icon: 'uil-globe',
          link: 'https://club.mochileros.com.mx/perfil/user/mapa_viajero/',
        },
        {
          title: 'HEADER.MESSAGES',
          icon: 'uil-envelope-check',
          link: 'https://club.mochileros.com.mx/messages/',
        },
        {
          title: 'HEADER.GROUPS',
          icon: 'uil-comments-alt',
          link: 'https://club.mochileros.com.mx/grupos-de-viaje/'
        },
        {
          title: 'HEADER.TRENDS_TOPIC',
          route: 'user/trips',
          link: 'https://club.mochileros.com.mx/temas-tendencia/'
        },
      ]
    },
    {
      title: 'HEADER.EXPLORE',
      icon: 'uil-search-alt',
      link: 'https://destinos.mochileros.com.mx/',
      // childs: [
      //   {
      //     title: 'HEADER.FAVORITE',
      //     icon: 'uil-heart-alt',
      //     link: 'https://destinos.mochileros.com.mx/mis-favoritos/'
      //   },
      //   {
      //     title: 'HEADER.MY_LIST',
      //     icon: 'uil-list-ul',
      //     link: 'https://destinos.mochileros.com.mx/mis-favoritos/'
      //   }
      // ]
    },
    // {
    //   title: 'HEADER.CONTACT',
    //   specialElement: 'contact',
    //   icon: 'uil-calling'
    // },

    {
      title: 'HEADER.LANGUAGE',
      specialElement: 'language',
      icon: ''
    },
    {
      title: 'HEADER.CURRENCIES',
      specialElement: 'currency',
      icon: ''
    },
  ]

  constructor(
    public service: SharedService,
    private formBuilder: FormBuilder,
    public rest: RestService,
    @Inject(PLATFORM_ID) private platformId: any,
    private _eref: ElementRef,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private mainService: MainSearchService,
    private tourService: ToursService,
    private cdref: ChangeDetectorRef,
    public serviceInput: InputSearchService
  ) {
    this.sendForm = this.formBuilder.group({
      search: [''],
    });

  }

  ngOnInit(): void {
    this.accountMenu = this.service.accountMenu
    const observerTwo$ = this.service.dataTourFilters.subscribe((res) => {
      this.data = res
      this.addPropertiesToData()
    });
    this.service.getFilters()
    this.listSubscribers = [observerTwo$];
    this.service.getCurrencySelect();

  }

  public get focusSearch(): boolean {
    return this.serviceInput.getGlobalFocusSearch
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }

  listenFocus($event: any) {
  }

  addPropertiesToData() {
    this.data.languages = [
      {
        key: "ES",
        name: 'GENERAL.SPANISH'
      },
      {
        key: "EN",
        name: 'GENERAL.ENGLISH'
      }
    ]
    this.data.duration = [
      {
        min: 0,
        max: 7,
        name: 'SEARCH.TOURS.FILTER_DURATION_TO_7',
      },
      {
        min: 8,
        max: 14,
        name: 'SEARCH.TOURS.FILTER_DURATION_TO_14',
      },
      {
        min: 15,
        max: 21,
        name: 'SEARCH.TOURS.FILTER_DURATION_TO_21',
      },
      {
        min: 21,
        max: 1000,
        name: 'SEARCH.TOURS.FILTER_DURATION_MORE_THAN',
      },
    ]
  }

  getData = (property: any) => this.data ? this.data[property] : null

  gotoTopLevel(child: any) {
    const { route, link, action } = child
    if (action) {
      action()
    } else if (link) {
      if (isPlatformBrowser(this.platformId)) {
        window.open(link, '_blank');
      }
    } else if (route) {
      this.router.navigateByUrl(route)
    }
  }

  goToDeepLevel(item: any, child: any, itemData: any) {
    if (item.key === 'tours') {
      let queryParams = {}
      const { keyParams } = child
      let nameProperty = 'code'
      if (keyParams === 'language') {
        nameProperty = 'key'
      } else if (keyParams === 'category') {
        nameProperty = 'slug'
      }
      queryParams = { [keyParams]: itemData[nameProperty] }
      if (keyParams === 'duration') {
        const { min, max } = itemData
        queryParams = { minDuration: min, maxDuration: max }
      }
      if (this.router.url.includes('search/tours')) {
        this.mainService.setParams(queryParams, this.tourService)
      } else {
        this.router.navigate([`/search/tours`], { queryParams });
      }
      // this.router.navigateByUrl(`${route}${segment}`)
    }
  }



  checkSession = () => this.rest.checkIsLogged();



  hideList(event: any) {
    if (event === 'notLoggin') {
      this.accountMenuActive = false
    }
  }
}
