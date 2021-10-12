import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'numberCountries'
})
export class NumberCountriesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let key = null;
    const cities = _.head(args);
    if (value === 1) {
      key = `GENERAL.${cities ? 'CITY' : 'COUNTRY'}`;

    } else {
      key = `GENERAL.${cities ? 'CITIES' : 'COUNTRIES'}`;
    }
    return key;
  }

}
