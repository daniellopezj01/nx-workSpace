import { BrowserModule, BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { RouterModule, UrlSerializer } from '@angular/router';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { LazyLoadImageModule } from 'ng-lazyload-image'; // <-- include ScrollHooks
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import es from '@angular/common/locales/es';
import { TimeagoModule } from 'ngx-timeago';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import '@egjs/hammerjs';
import 'mousetrap';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LOADING_BAR_CONFIG } from '@ngx-loading-bar/core';


import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from 'ngx-perfect-scrollbar';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { ToastNotificationsModule } from 'ngx-toast-notifications';
import { ErrorTailorModule } from '@ngneat/error-tailor';
import { NgxCopilotModule } from 'ngx-copilot';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SocketIoModule } from 'ngx-socket-io';
import { registerLocaleData } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { translateBrowserLoaderFactory } from './global/translate-browser.loader';
import { SocketProviderConnect } from './core/socket/web-socket.service';
import { VisibilityService } from './core/services/visibility.service';
import { CustomUrlSerializer } from './global/custom-url-serializer';
import { AuthInterceptorService } from './core/interceptors/auth-interceptor.service';
import { ManageHttpInterceptor } from './core/interceptors/manage-http.interceptor';
import { DEFAULT_TIMEOUT, TimeOutInterceptor } from './core/interceptors/time-out.interceptor';
import { BrowserStateInterceptor } from './core/interceptors/browserstate.interceptor';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { SharedModule } from './shared/shared.module';
import { HttpCancelService } from './core/services/http-cancel.service';

registerLocaleData(es);
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

// tslint:disable-next-line:typedef
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function anchorIonicErrorComponent(
  hostElement: Element,
  errorElement: Element
) {
  hostElement.parentElement?.insertAdjacentElement('afterend', errorElement);
  return () => {
    const errorNode = hostElement.parentElement?.querySelector(
      'error-class-tailor'
    );
    if (errorNode) {
      errorNode.remove();
    }
  };
}

// tslint:disable-next-line:typedef
export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,
    TransferHttpCacheModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    LoadingBarHttpClientModule,
    ToastNotificationsModule.forRoot({
      duration: 6000,
      type: 'light',
      position: 'top-right',
      autoClose: true,
    }),
    LottieModule.forRoot({ player: playerFactory }),
    ReactiveFormsModule,
    ErrorTailorModule.forRoot({
      errors: {
        useFactory(service: TranslateService) {
          return {
            required: 'This field is required',
          };
        },
        deps: [TranslateService],
      },
      controlErrorComponentAnchorFn: anchorIonicErrorComponent,
    }),
    FormsModule,
    SharedModule,
    GalleryModule.forRoot(),
    TimeagoModule.forRoot(),
    FontAwesomeModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    NgxLinkifyjsModule.forRoot(),
    NgSelectModule,
    PerfectScrollbarModule,
    NgxCopilotModule,
    HttpClientModule,
    LazyLoadImageModule,
    SocketIoModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateBrowserLoaderFactory,
        deps: [HttpClient, TransferState],
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    CookieService,
    TransferState,
    HttpCancelService,
    SocketProviderConnect,
    VisibilityService,
    { provide: UrlSerializer, useClass: CustomUrlSerializer },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ManageHttpInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: TimeOutInterceptor, multi: true },
    { provide: DEFAULT_TIMEOUT, useValue: 30000 },
    // {provide: HTTP_INTERCEPTORS, useClass: TranslateInterceptor, multi: true},
    { provide: LOADING_BAR_CONFIG, useValue: { latencyThreshold: 100 } },
    { provide: LOCALE_ID, useValue: 'es-ES' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BrowserStateInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
