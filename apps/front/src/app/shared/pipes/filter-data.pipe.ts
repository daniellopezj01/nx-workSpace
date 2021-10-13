import { Pipe, PipeTransform } from '@angular/core';
// import * as _ from 'lodash';

@Pipe({
  name: 'filterData',
})
export class FilterDataPipe implements PipeTransform {
  transform(value: any, args: any): any {
    try {
      return value[args];
    } catch (e) {
      return null;
    }
  }
}
