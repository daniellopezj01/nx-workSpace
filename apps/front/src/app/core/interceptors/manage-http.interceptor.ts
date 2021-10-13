// managehttp.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, ActivationEnd, RoutesRecognized } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { HttpCancelService } from '../services/http-cancel.service';

@Injectable()
export class ManageHttpInterceptor implements HttpInterceptor {
  constructor(router: Router, private httpCancelService: HttpCancelService) {
    router.events.subscribe((event) => {
      if (event instanceof RoutesRecognized) {
        this.httpCancelService.cancelPendingRequests();
      }

      // An event triggered at the end of the activation part of the Resolve phase of routing.
    });
  }

  intercept<T>(
    req: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    if (req.url.split('/').includes('assets')) {
      return next.handle(req);
    } else {
      return next
        .handle(req)
        .pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()));
    }
  }
}
