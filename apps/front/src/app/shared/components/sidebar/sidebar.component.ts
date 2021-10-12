import { Subscription } from 'rxjs';
import { Component, OnInit, HostBinding, HostListener, Inject, PLATFORM_ID, OnDestroy, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { faMapMarkerAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { RestService } from '../../../core/services/rest.service';
import { SharedService } from '../../../core/services/shared.service';
import { ToursService } from '../../../search/pages/tours/services/tours.service';
import { MainSearchService } from '../../../search/pages/main-search.service';

interface ItemSidebar {
  text: string;
  activeSidebar: boolean;
  router: string | boolean;
  class?: string;
  href?: string;
  child?: Array<any>;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy, AfterContentChecked {


  @HostListener('click', ['$event']) click(e: any) {
    e.stopPropagation();
  }

  @HostListener('click', ['$event', '$event.target']) resetToggle(
    event: MouseEvent,
    targetElement: HTMLElement
  ) {
    // this.isMenuOpen = false;
  }
  @HostBinding('class.active') isMenuOpen = false;
  public listSubscribers: any = [];
  public data: any;
  public structureSidebar = [
    {
      title: 'HEADER.PROFILE',
      icon: 'uil-user',
      key: 'profile',
      route: 'profile'
    },
    {
      title: 'HEADER.MY_ACCOUNT',
      icon: 'uil-user-square',
      key: 'account',
      childs: [
        {
          title: 'HEADER.SOCIAL_PROFILE',
          icon: 'uil-user-square',
          link: 'https://club.mochileros.com.mx/perfil/'
        },
        {
          title: 'HEADER.DASHBOARD',
          icon: 'uil-bars',
          link: 'https://club.mochileros.com.mx/dashboard/'
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
      ]
    },
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
      link: 'https://destinos.mochileros.com.mx/vuelos/'
    },
    {
      title: 'HEADER.MORE',
      icon: 'uil-bus-alt',
      key: 'more',
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
      key: 'comunity',
      // link: 'https://club.mochileros.com.mx/',
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
      link: 'https://destinos.mochileros.com.mx/'
    },
    // {
    //   title: 'HEADER.CONTACT',
    //   specialElement: 'contact',
    //   icon: 'uil-calling'
    // },
    {
      title: 'HEADER.NEWS_BLOGS',
      icon: 'uil-newspaper',
      link: 'https://blog.mochileros.com.mx/'
    },
    {
      title: 'HEADER.ABOUT_US',
      icon: 'uil-check-circle',
      link: 'https://info.mochileros.com.mx/sobre-nosotros/'
    },
    {
      title: 'HEADER.CONTACT',
      icon: 'uil-phone',
      link: 'https://destinos.mochileros.com.mx/contacto/',
    }
  ]
  public currentId = ''
  public openItem = false
  public activeItem = 0;
  public activeItemChild = 0;
  public faMapMarkerAlt = faMapMarkerAlt;
  public faTimes = faTimes;
  public loading = true;

  checkAction: boolean = false;

  toggle(e: any) {
    e.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  constructor(
    public translate: TranslateService,
    private router: Router,
    public rest: RestService,
    private mainService: MainSearchService,
    private tourService: ToursService,
    private shared: SharedService,
    private cdref: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: any) {
  }

  ngOnInit(): void {
    this.loading = true
    const observerOne$ = this.shared.dataTourFilters.subscribe((res) => {
      this.data = res
      this.addPropertiesToData()

      this.loading = false
    });
    this.shared.getFilters()
    this.listSubscribers = [observerOne$];
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
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

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  changeActive(i: any) {
    this.activeItem = this.activeItem === i ? 0 : i;
  }

  changeActiveChild(newCurrenId: any) {
    if (this.currentId === newCurrenId) {
      this.openItem = !this.openItem
    } else {
      this.currentId = newCurrenId
      this.openItem = true
    }
  }

  changeStatus(id: any, show = true) {
    const e: any = document.getElementById(
      `${id}`
    );
    if (show) {
      e.classList.remove('toggle')
    } else {
      e.classList.add('toggle')
    }
  }

  goToDeepLevel(child: any, itemData: any) {
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

  menuItemClickHandler(e: any, index: any) {
    e.stopPropagation();
  }

  // goTo = (route) => {
  //   if (isPlatformBrowser(this.platformId) && route) {
  //     (route.includes('http')) ? window.open(route) : this.router.navigateByUrl(route);
  //     this.closeSidebar();
  //   }
  // }

  mainLevel(child: any, i: any) {
    this.changeActive(i + 1)
    this.navigate(child)
  }

  gotoTopLevel(child: any, currentId: any) {
    this.changeActiveChild(currentId)
    this.navigate(child)
  }

  navigate(child: any) {
    const { route, link } = child
    if (link) {
      if (isPlatformBrowser(this.platformId)) {
        window.open(link, '_blank');
      }
    } else if (route) {
      this.router.navigateByUrl(route)
    }
  }

  closeSidebar() {
    this.isMenuOpen = false;
  }
}
