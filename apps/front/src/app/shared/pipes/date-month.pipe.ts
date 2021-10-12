import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateMonth',
})
export class DateMonthPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    if (value) {
      const { month, year } = value;
      return year + '/' + month + '/' + '01';
    }
    return null;
  }
}
