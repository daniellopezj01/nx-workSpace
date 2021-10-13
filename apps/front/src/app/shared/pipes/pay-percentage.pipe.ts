import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({
  name: 'payPercentage',
})
export class PayPercentagePipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): any {
    return null;
  }
}
