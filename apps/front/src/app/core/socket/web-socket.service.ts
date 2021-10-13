import { Injectable, EventEmitter, Output } from '@angular/core';

/**
 * --------------------------------------
 * Importamos los paquetes necesarios "ngx-socket-io" tambien nuestro "environments" y por último
 * "ngx-cookie-service",
 * ----------------------------------------
 */
import { Socket } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';

@Injectable()
/**
 * Extendemos la clase "Socket" a nuestra clase
 */
export class SocketProviderConnect extends Socket {
  @Output() outEven: EventEmitter<any> = new EventEmitter();

  constructor(private cookieService: CookieService) {

    super({
      url: environment.serverSocket,
      options: {
        extraHeaders: {
          Authorization: `Bearer ${cookieService.get('session')}`,
        },
        query: `token=${cookieService.get('session')}`,
      },
    });
    this.ioSocket.on('push_message', (res: any) => this.outEven.emit(res));
  }
}
