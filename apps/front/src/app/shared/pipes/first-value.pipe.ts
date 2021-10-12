import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'firstValue',
})

export class FirstValuePipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): any {
    return value[0] ? _.head(value) : value;
  }
}
