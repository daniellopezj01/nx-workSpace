import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({
  name: 'discountPrice',
})
export class DiscountPricePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value) {
      const globalDiscount = args.length ? _.head(args) : 100;
      const { payAmount, normalPrice } = value;
      if (payAmount?.length) {
        const item = _.find(
          payAmount,
          (i) => i.percentageAmount === globalDiscount
        );
        if (item) {
          const { discount, amountDiscount } = item;
          let globalAmount: any;
          if (discount === 'amount') {
            globalAmount = (normalPrice - amountDiscount).toFixed(2);
          } else {
            const priceDiscount = (normalPrice * amountDiscount) / 100;
            globalAmount = (normalPrice - priceDiscount).toFixed(2);
          }
          return (globalAmount * Number(globalDiscount)) / 100;
        }
      }
      return null;
    }
  }
}
