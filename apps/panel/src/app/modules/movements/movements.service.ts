/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class MovementsService {
  public platform: any = [
    {
      name: 'Stripe',
      value: 'stripe',
    },
    {
      name: 'PayPal',
      value: 'paypal',
    },
    {
      name: 'Efectivo',
      value: 'cash',
    },
    {
      name: 'Descuento',
      value: 'discount',
    },
    {
      name: 'Transferencia Bancaria',
      value: 'Transferencia Bancaria',
    },
  ];
  constructor() { }

  public searchPlatform(value: any) {
    const item = _.find(this.platform, i => i.value === value)
    return item?.name
  }
}
