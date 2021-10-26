import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from 'ngx-perfect-scrollbar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastNotificationsModule } from 'ngx-toast-notifications';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  DEFAULT_TIMEOUT,
} from './services//TimeOutInterceptor';
import player from 'lottie-web';
import { SharedModule } from './modules/shared/shared.module';
import { LottieModule } from 'ngx-lottie';
import { NotFoundComponent } from './not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AuthInterceptorService } from './services/auth/auth-interceptor.service';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { TagInputModule } from 'ngx-chips';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { AddMovementComponent } from './modules/movements/pages/add-movement/add-movement.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AvatarModule } from 'ngx-avatar';
import { ModalItineraryComponent } from './modules/tours/pages/modal-itinerary/modal-itinerary.component';
import { ModalActivityComponent } from './modules/tours/pages/modal-activity/modal-activity.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { TimeagoModule } from 'ngx-timeago';
import { NotImageDirective } from './directives/not-image.directive';
import { FormIncludeComponent } from './modules/tours/pages/form-include/form-include.component';
import { NgxPrettyCheckboxModule } from 'ngx-pretty-checkbox';
import { ModalPayAmountComponent } from './modules/tours/pages/modal-pay-amount/modal-pay-amount.component';
import { ErrorTailorModule } from '@ngneat/error-tailor';
import { TranslateService } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

registerLocaleData(es);
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    dateInputFormat: 'DD-MMM-YYYY',
    isAnimated: true,
    showWeekNumbers: false,
  });
}

// tslint:disable-next-line:typedef
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
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// tslint:disable-next-line:typedef
export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    ModalItineraryComponent,
    ModalActivityComponent,
    AddMovementComponent,
    NotImageDirective,
    FormIncludeComponent,
    ModalPayAmountComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    FontAwesomeModule,
    HttpClientModule,
    TooltipModule.forRoot(),
    TimeagoModule.forRoot(),
    ErrorTailorModule.forRoot({
      errors: {
        // tslint:disable-next-line:typedef
        useFactory(service: TranslateService) {
          return {
            required: '(*)',
          };
        },
        deps: [TranslateService],
      },
      controlErrorComponentAnchorFn: anchorIonicErrorComponent,
    }),
    ToastNotificationsModule.forRoot({
      duration: 6000,
      type: 'light',
      position: 'top-right',
      autoClose: true,
    }),
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    LottieModule.forRoot({ player: playerFactory }),
    LoadingBarModule,
    LoadingBarHttpClientModule,
    BsDatepickerModule.forRoot(),
    SharedModule,
    BrowserAnimationsModule,
    NgxMaskModule.forRoot(),
    TagInputModule,
    NgSelectModule,
    NgxPrettyCheckboxModule,
    AvatarModule,
    PerfectScrollbarModule,
  ],
  exports: [AddMovementComponent,
  ],
  providers: [
    [{ provide: DEFAULT_TIMEOUT, useValue: 30000 }],
    { provide: BsDatepickerConfig, useFactory: getDatepickerConfig },
    [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptorService,
        multi: true,
      },
    ],
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
