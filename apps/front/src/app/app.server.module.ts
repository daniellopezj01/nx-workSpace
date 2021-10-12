import { Inject, Injectable, NgModule, Optional, PLATFORM_ID } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { TransferState } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';
import { isPlatformServer } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { translateServerLoaderFactory } from './global/translate-server.loader';
import { ServerStateInterceptor } from './core/interceptors/serverstate.interceptor';



@Injectable()
// @ts-ignore
export class UniversalDeviceDetectorService extends DeviceDetectorService {
  // @ts-ignore
  constructor(@Inject(PLATFORM_ID) platformId: any, @Optional() @Inject(REQUEST) request: Request) {
    super(platformId);
    if (isPlatformServer(platformId)) {
      super.setDeviceInfo((request.headers['user-agent'] as string) || '');
    }
  }
}

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: translateServerLoaderFactory,
        deps: [TransferState],
      },
    }),
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: DeviceDetectorService,
      useClass: UniversalDeviceDetectorService
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerStateInterceptor,
      multi: true
    }]
})
// @ts-ignore
export class AppServerModule {
}
