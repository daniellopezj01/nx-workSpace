import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-first-line',
  templateUrl: './first-line.component.html',
  styleUrls: ['./first-line.component.scss']
})
export class FirstLineComponent {

  public structureHeader = [
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
      link: null,
      child: [{
        title: ''
      }]
    }
  ]
  constructor(@Inject(PLATFORM_ID) private platformId: any) { }

  goTo(link: any) {
    if (isPlatformBrowser(this.platformId)) {
      if (link) {
        window.open(link);
      }
    }
  }
}
