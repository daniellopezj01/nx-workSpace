import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'savePayingAll',
})
export class SavePayingAllPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    if (value) {
      const globalDiscount = args.length ? _.head(args) : 100;
      const { payAmount, normalPrice } = value;
      if (payAmount?.length) {
        const item = _.find(
          payAmount,
          (i) => i.percentageAmount === globalDiscount
        );
        const { discount, amountDiscount } = item;
        if (discount === 'amount') {
          const discountMoney = normalPrice - amountDiscount;
          return (normalPrice - discountMoney).toFixed(2);
        } else {
          const priceDiscount = (normalPrice * amountDiscount) / 100;
          // console.log(priceDiscount);
          const discountMoney = normalPrice - priceDiscount;
          return (normalPrice - discountMoney).toFixed(2);
        }
      }
    }
    return null;
  }
}
