import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'convertTimeClear',
})
export class ConvertTimeClearPipe implements PipeTransform {
  transform(value: any, args: any): unknown {
    const start = moment.unix(value).format('YYYY/MM/DD');
    return moment(`${start} ${args}`, 'YYYY/MM/DD HH:mm').format(
      'YYYY/MM/DD HH:mm'
    );
  }
}
