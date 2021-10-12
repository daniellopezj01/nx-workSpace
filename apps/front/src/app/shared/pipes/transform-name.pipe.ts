import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformName'
})
export class TransformNamePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): any {
    const { name, surname } = value;
    return `${name || 'unknown'} ${surname || ''} `;
  }

}
