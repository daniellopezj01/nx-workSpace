import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'convertTimeClear',
})
export class ConvertTimeClearPipe implements PipeTransform {
  transform(value: any, args: any): any {
    const start = moment.unix(value).format('YYYY/MM/DD');
    return moment(`${start} ${args}`, 'YYYY/MM/DD HH:mm').format(
      'YYYY/MM/DD HH:mm'
    );
  }
}
