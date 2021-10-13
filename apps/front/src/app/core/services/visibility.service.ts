import {ElementRef, Inject, Injectable} from '@angular/core';
import {combineLatest, concat, defer, fromEvent, Observable, Observer, of} from 'rxjs';
import {distinctUntilChanged, flatMap, map} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';


@Injectable()
export class VisibilityService {

  private pageVisible$: Observable<boolean>;

  constructor(@Inject(DOCUMENT) document: any) {
    this.pageVisible$ = concat(
      defer(() => of(!document.hidden)),
      fromEvent(document, 'visibilitychange')
        .pipe(
          map(e => !document.hidden)
        )
    );
  }

  elementInSight(element: ElementRef): Observable<boolean> {
    const el = element.nativeElement;


    const elementVisible$ = new Observable((observer: Observer<any>) => {
      const intersectionObserver = new IntersectionObserver(entries => {
        observer.next(entries);
      });
      intersectionObserver.observe(el);
      return () => {
        intersectionObserver.disconnect();
      };
    }).pipe(
      flatMap((entries: IntersectionObserverEntry[]) => entries),
      map((entry: any) => entry.isIntersecting),
      distinctUntilChanged()
    );

    return combineLatest(
      this.pageVisible$,
      elementVisible$,
      (pageVisible, elementVisible: boolean) => pageVisible && elementVisible
    ).pipe(
      distinctUntilChanged()
    );
  }

}
