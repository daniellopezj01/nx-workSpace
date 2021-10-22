import { Component } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { animate, style, transition, trigger } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { RestService } from './services/rest/rest.service';
import { SharedService } from './modules/shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('swipe', [
      transition(':enter', [
        style({ transform: 'translateY(-20%)', opacity: '0' }),
        animate('0.2s ease-in'),
      ]),
      transition(':leave', [
        animate(
          '0.2s ease-out',
          style({ transform: 'translateY(20%)', opacity: '1' })
        ),
      ]),
    ]),
  ],
})
export class AppComponent {
  title = 'front-inventory';
  progress: any = 0;
  error: any = null;
  copilot: any = null;

  constructor(
    public loader: LoadingBarService,
    public shared: SharedService,
    public rest: RestService,
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private router: Router,
    private deviceService: DeviceDetectorService
  ) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        /**
         * AQUI DEMOS INJECTAR UNA CLASE O ALGO PARA EL COPILOT
         */
        // @ts-ignore
        if (event.url.includes('purchase')) {
          // shared.copilot.subscribe(a => this.copilot = a)
        }
      });
    this.loader.progress$.subscribe((res) => {
      this.progress = res;
    });

    this.rest.catchError.subscribe((res) => {
      this.error = res;
    });

    const isDesktopDevice = this.deviceService.isDesktop();
    if (!isDesktopDevice) {
      this.shared.copilot.emit(true);
    }
  }

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        this.shared.openUpdateModal();
      });
    }
  }
}
