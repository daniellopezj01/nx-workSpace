import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countDownTime',
})
export class CountDownTimePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
