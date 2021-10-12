import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'reverser',
})
export class ReverserPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    try {
      return _.reverse(value);
    } catch (e) {
      return null;
    }
  }
}
