import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundUp'
})
export class RoundUpPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): any {
    if (value % 1 !== 0) {
      return parseInt(value) + 1
    }
    return value;
  }

}
