import { Pipe, PipeTransform } from '@angular/core';
// import * as _ from 'lodash';

@Pipe({
  name: 'filterData',
})
export class FilterDataPipe implements PipeTransform {
  transform(value: unknown, args: any): unknown {
    try {
      return value[args];
    } catch (e) {
      return null;
    }
  }
}
