import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'smallPercentage',
})
export class SmallPercentagePipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): any {
    if (value) {
      const { payAmount, normalPrice } = value;
      const min = _.minBy(payAmount, (i: any) => i.percentageAmount);
      if (min && min?.percentageAmount !== 100) {
        const { percentageAmount, specialPayment } = min;
        return {
          percentage: percentageAmount,
          amount: (normalPrice * percentageAmount) / 100,
          specialPayment
        };
      }
    }

    return null;
  }
}
