import { DatePipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DepartureService } from '../../services/departure.service';
import { RestService } from '../../../core/services/rest.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss'],
})
export class StepTwoComponent implements OnInit, OnDestroy {
  activeDepartures: any;

  @Input() tour: any;
  @Input() isLogged = false;
  public activePercentage: any = 0;
  public loading = false;
  public contracts: any;
  public selectPayAmount: any;
  public listSubscribers: any = [];
  public itemDescription = [
    {
      name: 'DEPARTURES.COMMENT_ONE',
    },
    {
      name: 'DEPARTURES.COMMENT_TWO',
    },
    {
      name: 'DEPARTURES.COMMENT_THREE',
    },
    {
      name: 'DEPARTURES.COMMENT_FOUR',
    },
  ];

  constructor(
    public datePipe: DatePipe,
    public service: DepartureService,
    private rest: RestService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
  }

  ngOnInit(): void {
    this.listObserver();
  }

  listObserver = () => {
    const observer1$ = this.service.nextStep.subscribe((item) => {
      this.activeDepartures = item;
      if (this.activeDepartures) {
        this.transformDeparture();
      }
    });
    const observer2$ = this.service.goToReservation.subscribe(() => {
      this.gotoReservation();
    });
    this.listSubscribers.push(observer1$, observer2$);
  }

  calcDiscount = (max: any, min: any) => Math.trunc(max - min);

  selectCity(type: any): void {
    const { itinerary } = this.tour;
    return itinerary?.length
      ? itinerary[type === 'Start' ? 0 : itinerary.length - 1].stringLocation
        .city
      : null;
  }

  transformDeparture = () => {
    this.loading = true;
    let { payAmount } = this.activeDepartures;
    payAmount = _.orderBy(
      _.map(payAmount, (i) => Number(i.percentageAmount)),
      [],
      ['desc']
    );
    this.activePercentage = _.head(payAmount);
    this.activeDepartures = {
      ...this.activeDepartures,
      ordersAmounts: payAmount,
    };
    setTimeout(() => {
      this.getContracts();
    }, 1000);
  }

  selectPercentagePay(value: number) {
    const { specialPrice, normalPrice } = this.activeDepartures;
    const currentValue = specialPrice || normalPrice;
    const total = parseFloat(currentValue) * (value / 100);
    this.activeDepartures = {
      ...this.activeDepartures,
      total,
    };
  }

  createObject(event: any) {
    const { payAmount, _id, ordersAmounts } = this.activeDepartures;
    this.selectPayAmount = _.find(
      payAmount,
      (i) => i.percentageAmount === ordersAmounts[event]
    );
    if (this.selectPayAmount) {
      const { percentageAmount, intent } = this.selectPayAmount;
      return {
        id: _id,
        payAmount: percentageAmount,
        intent,
      };
    } else {
      console.log('No tiene porcentaje de pago');
      return null;
    }
  }

  async getContracts(event = this.service.selectIndexPercentage) {
    this.contracts = null;
    this.loading = true;
    this.service.selectIndexPercentage = event;
    const object: any = this.createObject(event);
    this.rest.post('contracts', object).subscribe(
      (res) => {
        this.loading = false;
        this.contracts = res;
      },
      (err) => {
        this.loading = false;
        console.log(err);
      }
    );
  }

  gotoReservation(): void {
    this.router.navigate([
      `reservation/${this.tour.slug}/${this.contracts._id}`,
    ]);
  }

  ngOnDestroy() {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }
}
