import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'currencyFlight',
})
export class CurrencyFlightPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    try {
      const currency = _.get(args[0], args[1].toLowerCase());
      if (!currency) {
        throw new Error('');
      }
      return Number(Number(value) / Number(currency));
    } catch (e) {
      return Number(value);
    }
  }
}
