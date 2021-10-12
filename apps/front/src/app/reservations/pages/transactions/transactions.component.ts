import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  public codeReservation: any;
  public data: any;
  public loading = false;
  public faCheckCircle = faCheckCircle;
  public departure: any;

  public colorLevels = {
    0: '#dc3545',
    25: '#f5cb5c',
    50: '#3993dd',
    70: '#52b788',
  };
  public columns = [
    { key: 'USER.WALLET.KEY_AMOUNT' },
    { key: 'USER.WALLET.KEY_STATUS' },
    { key: 'USER.WALLET.KEY_DATE' },
    { key: 'USER.WALLET.KEY_PLATFORM' },
  ];

  constructor(
    private activeRouter: ActivatedRoute,
    private rest: RestService,
    private library: FaIconLibrary,
    public translate: TranslateService,
    private router: Router,
    public deviceService: DeviceDetectorService,
  ) {
    library.addIcons(faCheckCircle);
  }

  ngOnInit(): void {
    this.codeReservation = this.activeRouter.snapshot?.parent?.params.id;
    this.loadData();
  }

  loadData(): any {
    this.loading = true;
    this.rest
      .get(`reservations/payment/${this.codeReservation}`)
      .pipe(
        tap(() => (this.loading = false)),
        catchError((err) => {
          this.loading = err;
          return throwError(err);
        })
      )
      .subscribe(
        (res) => {
          this.data = res;
          const { departure } = this.data;
          this.departure = departure;
        },
        (err) => {
          this.router.navigate(['user/trips']);
        }
      );
  }

  progress() {
    return `${100 - this.data?.pendingProgress}`
  }

  // goToPay() {
  //   this.router.navigate([`payment/${this.codeReservation}`]);
  // }
}
