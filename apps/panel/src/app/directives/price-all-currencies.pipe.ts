import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { AuthService } from '../services/auth/auth.service';
import { RestService } from '../services/rest/rest.service';
import * as _ from 'lodash'

@Pipe({
  name: 'priceAllCurrencies'
})
export class PriceAllCurrenciesPipe implements PipeTransform {

  public currencies: any
  constructor(private authService: AuthService, private storageService: LocalStorageService) {
    this.loadCurrencies()
  }

  async loadCurrencies() {
    const { currencies } = this.storageService.get('settings')
    if (currencies) {
      this.currencies = currencies
    } else {
      await this.authService.checkSession()
      const { currencies } = this.storageService.get('settings')
      this.currencies = currencies
    }
  }

  transform(value: string, currenciesDeparture: any[] = []): any {
    if (value) {
      const currentValue = parseFloat(value)
      let string = ''
      const newArray = _.unionBy(currenciesDeparture, this.currencies, 'name')
      _.map(newArray, (c: any) => {
        if (c?.value !== 1)
          string += ` ${c?.value * currentValue} ${c?.name} -`
      })
      return string.slice(0, -1);
    }
  }

}
