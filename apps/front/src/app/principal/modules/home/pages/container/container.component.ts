import { RestService } from './../../../../../core/services/rest.service';
import { SharedService } from './../../../../../core/services/shared.service';
import {
  Component,
  OnInit,
  HostListener,
  Inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  AfterViewInit, ViewChild, ElementRef,
} from '@angular/core';

import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { isPlatformBrowser } from '@angular/common';
import { filter, map, take, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild('histories') histories?: ElementRef;
  createComponentBlog?: Observable<boolean>;
  isBrowser: boolean;
  faInstagram = faInstagram;
  blogsInfo = [
    {
      title: 'MAIN.BLOG_ONE.TITLE',
      content: 'MAIN.BLOG_ONE.CONTENT',
      color: '#FFFFFF',
    },
    {
      title: 'MAIN.BLOG_TWO.TITLE',
      content: 'MAIN.BLOG_TWO.CONTENT',
      color: '#FFFFFF',
    },
  ];
  communityData: any = [];
  historiesData: any = [];
  destinationData: any = [
    {
      name: 'Budapest',
      img: 'https://dssvuzr9zfb17.cloudfront.net/destine_budapest.webp',
      city: {
        cityName: 'Budapest',
        id: '1333',
        countryName: 'Budapest',
      },
    },
    {
      name: 'Londres',
      img: 'https://dssvuzr9zfb17.cloudfront.net/destine_alps.webp',
      city: {
        countryName: 'Londres',
        cityName: 'Londres',
        id: '7896',
      },
    },
    {
      name: 'Perú',
      img: 'https://dssvuzr9zfb17.cloudfront.net/destine_peru.webp',
      city: {
        id: '12048',
        cityName: 'Perú',
        fullName: 'Perú',
      },
    },
    {
      name: 'Alpes',
      img: 'https://dssvuzr9zfb17.cloudfront.net/destine_alps.webp',
      city: {
        cityName: 'Berlin',
        id: '9510',
        fullName: 'Berlin',
      },
    },
    {
      name: 'Paris',
      img: 'https://dssvuzr9zfb17.cloudfront.net/destine_paris.webp',
      city: {
        cityName: 'Paris',
        id: '15542',
        fullName: 'Paris',
      },
    },
    {
      name: 'Praga',
      img: 'https://dssvuzr9zfb17.cloudfront.net/destine_prague.webp',
      city: {
        fullName: 'Praga',
        cityName: 'Praga',
        id: '6557',
      },
    },
    {
      name: 'Roma',
      img: 'https://dssvuzr9zfb17.cloudfront.net/destine_rome.webp',
      city: {
        cityName: 'Roma',
        fullName: 'Roma',
        id: '13559',
      },
    },
    {
      name: 'Tailandia',
      img: 'https://dssvuzr9zfb17.cloudfront.net/destine_thailand.webp',
      city: {
        cityName: 'Bangkok',
        fullName: 'Bangkok',
        id: '25949',
      },
    },
  ];
  generalData: any = [
    {
      title: 'MAIN.BLOCK_ONE.TITLE',
      subTitle: 'MAIN.BLOCK_ONE.DESCRIPTION',
      img: 'https://dssvuzr9zfb17.cloudfront.net/mochi01.webp',
    },
    {
      title: 'MAIN.BLOCK_TWO.TITLE',
      subTitle: 'MAIN.BLOCK_TWO.DESCRIPTION',
      img: 'https://dssvuzr9zfb17.cloudfront.net/friends_party.webp',
    },
    {
      title: 'MAIN.BLOCK_THREE.TITLE',
      subTitle: 'MAIN.BLOCK_THREE.DESCRIPTION',
      img: 'https://dssvuzr9zfb17.cloudfront.net/trip_cold.webp',
    },
  ];

  constructor(
    private library: FaIconLibrary,
    public translate: TranslateService,
    private router: Router,
    private shared: SharedService,
    @Inject(PLATFORM_ID) private platformId: any,
    private rest: RestService,
  ) {
    library.addIcons(faInstagram);
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.getPostExternal();
    this.getPostFromInstagram();
  }

  getPostExternal(): any {
    // this.rest
    //   .get(`external/blog`, true, { ignoreLoadingBar: '' })
    //   .pipe(
    //     map((a) => {
    //       return a?.data.map((b) => {
    //         b.title = b?.title?.rendered || '';
    //         // @ts-ignore
    //         b.creator = _.head(b?._embedded?.author);
    //         b.href = b?.link;
    //         b.image = b?.fimg_url;
    //         return b;
    //       });
    //     })
    //   )
    //   .subscribe((res:any) => {
    //     this.historiesData = res;
    //   });
  }

  getPostFromInstagram(): any {
    // this.rest
    //   .get(`external/instagram`, true, { ignoreLoadingBar: '' })
    //   .pipe(
    //     map((a) => {
    //       return a?.data.map((b) => {
    //         if (
    //           b?.media_type === 'IMAGE' ||
    //           (b?.media_type === 'CAROUSEL_ALBUM' && b?.media_url)
    //         ) {
    //           b.name = b?.username || '';
    //           b.img = b?.media_url || '';
    //           return b;
    //         }
    //       });
    //     })
    //   )
    //   .subscribe((res:any) => {
    //     this.communityData = _.compact(res);
    //   });
  }

  searchCity(item: any) {
    const { id, cityName } = item.city;
    this.router.navigate(['search/'], {
      queryParams: {
        q: `[A:${cityName.toUpperCase()},B:${cityName.toUpperCase()},C:${id}]`,
      },
    });
  }
}
