import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RestService } from 'apps/front/src/app/core/services/rest.service';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.scss'],
})
export class PopularComponent implements OnInit {
  public sizeItemCarousel: any = 450;
  public data: any;
  public arrows = true;
  public loading = true;
  public width: number = 0;

  constructor(
    private rest: RestService,
    private router: Router,
    private cdref: ChangeDetectorRef,
    public deviceService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {

  }

  ngOnInit(): void {
    this.rest.get('tours?limit=10').subscribe(
      (res: any) => {
        const { docs } = res;
        this.data = docs.reverse();
        this.loading = false;
      },
      (err) => {
        console.log(err);
      }
    );
    if (isPlatformBrowser(this.platformId)) {
      if (this.deviceService.isDesktop() || this.deviceService.isTablet()) {
        this.sizeItemCarousel = 400;
      }
    }
  }

  gotoDetails(tour: any) {
    this.router.navigate([`/destination/${tour.slug}`]);
  }
}
