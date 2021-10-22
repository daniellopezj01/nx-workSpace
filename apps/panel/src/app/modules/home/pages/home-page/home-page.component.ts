import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faPhoneAlt,
  faUser,
  faLongArrowAltUp,
  faLongArrowAltDown,
} from '@fortawesome/free-solid-svg-icons';
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { forkJoin, Observable, of } from 'rxjs';
import { finalize, map, take, tap } from 'rxjs/operators';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RestService } from 'src/app/services/rest/rest.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0 }),
            stagger(30, [animate(100, style({ opacity: 1 }))]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class HomePageComponent implements OnInit {
  public inventory: any = [];
  faPhoneAlt = faPhoneAlt;
  faUser = faUser;
  faLongArrowAltUp = faLongArrowAltUp;
  faLongArrowAltDown = faLongArrowAltDown;
  private callsHttp = [];
  public loading: boolean;
  public dataResponse: any = {
    one: {
      tap: {},
      rxjs: of([]),
    },
    two: {
      tap: {},
      rxjs: of([]),
    },
    three: {
      tap: {},
      rxjs: of([]),
    },
  };

  private sources = [];

  constructor(
    private rest: RestService,
    private auth: AuthService,
    public share: SharedService
  ) { }

  ngOnInit(): void {
    const currentUser = this.auth.getCurrentUser();
    this.sources = [
      {
        key: 'one',
        available: ['admin', 'manager', 'seller'].includes(currentUser?.role),
        value: `reservations/all?limit=10`,
      },
      {
        key: 'two',
        available: ['admin', 'manager', 'seller'].includes(currentUser?.role),
        value: `tours?limit=10`,
      },
      {
        key: 'three',
        available: ['admin', 'manager', 'seller'].includes(currentUser?.role),
        value: `payOrders?limit=10`,
      },
    ];

    this.loadInitial();
  }

  loadInitial = () => {
    this.loading = true;
    this.requestMultipleData()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((list) => {
        this.dataResponse.one.rxjs = of(list[0]);
        this.dataResponse.two.rxjs = of(list[1]);
        this.dataResponse.three.rxjs = of(list[2]);
      });
  };

  public requestMultipleData(): Observable<any[] | any> {
    this.callsHttp = [];
    this.sources.forEach((value) => {
      if (value.available) {
        this.callsHttp.push(
          this.rest.get(value.value).pipe(
            map((b) => b.docs),
            tap((a) => (this.dataResponse[value.key] = { tap: a }))
          )
        );
      }
    });
    return forkJoin(this.callsHttp);
  }
}
