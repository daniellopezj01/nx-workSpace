import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toAny'
})
export class ToAnyPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): any {
    return value;
  }

}
