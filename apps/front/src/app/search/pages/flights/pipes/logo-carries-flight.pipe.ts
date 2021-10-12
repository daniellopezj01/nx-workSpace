import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'logoCarriesFlight',
})
export class LogoCarriesFlightPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    try {
      return `http://pics.avs.io/80/80/${value?.carrier?.operating}.png`;
    } catch (e) {
      return null;
    }
  }
}
