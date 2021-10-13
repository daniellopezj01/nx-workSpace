import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'lastValue',
})
export class LastValuePipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): any {
    return _.last(value);
  }
}
