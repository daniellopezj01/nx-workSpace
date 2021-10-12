import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'routeTranslate'
})
export class RouteTranslatePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    const sub = 'ROUTES.';
    let newValue = value;
    if (value.includes(sub)) {
      const array = value.split('.');
      newValue = _.last(array);
    }
    return newValue;
  }
}
