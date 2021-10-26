import { OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as _ from 'lodash';
import { SharedService } from '../../core/services/shared.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'currencyCurrent',
  pure: false,
})
export class CurrencyCurrentPipe implements PipeTransform, OnDestroy {
  private value: any;
  private args: any = {};
  private currenciesDeparture: any = {};
  public listSubscribers: any = [];
  public currencies: any;

  constructor(
    private cookieService: CookieService,
    private sharedService: SharedService) {
    this.loadCurrencies();
    this.listObserver();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }

  listObserver = () => {
    const observer1$ = this.sharedService.changeCurrency.subscribe((res: any) => {
      this.transform(this.value, this.args);
    });

    this.listSubscribers.push(observer1$);
  }


  async loadCurrencies() {
    const currencies = this.cookieService.get('currencies');
    if (currencies) {
      this.currencies = JSON.parse(currencies);
    }
  }

  transform(value: any, args: any = {}, currenciesDeparture: any = []): unknown {
    try {
      this.value = value;
      this.args = args;
      this.currenciesDeparture = currenciesDeparture;
      // this.value = this.value.split(',').join('');
      this.value = this.value.split('.').join('');
      this.value = this.value.split(',').join('.');
      this.value = parseFloat(this.value);
      let argsExtra: any =
        typeof this.args === 'string' ? this.args.split(':') : [];
      argsExtra = argsExtra?.length
        ? { decimal: _.head(argsExtra), label: _.last(argsExtra) }
        : {};
      this.args = { ...{ decimal: 2, label: false }, ...argsExtra };
      const currency: any = this.cookieService.get('currencySelect');
      let valueCurrency = JSON.parse(currency);
      const fromDeparture = _.find(this.currenciesDeparture, a => a?.name === valueCurrency?.name);
      if (fromDeparture) {
        valueCurrency = fromDeparture;
      }
      const label = this.args?.label === 'true' ? valueCurrency?.name : '';

      const num = Number(valueCurrency?.value * Number(this.value)).toFixed(
        this.args?.decimal
      );
      return `${Number.parseFloat(num).toLocaleString('en-US', { maximumFractionDigits: 2 })} ${label}`;
    } catch (e) {
      return null;
    }
  }
}
