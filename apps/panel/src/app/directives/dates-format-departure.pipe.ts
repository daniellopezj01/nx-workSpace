import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'datesFormatDeparture',
})
export class DatesFormatDeparturePipe implements PipeTransform {
  transform(value: any, args: any = null): unknown {
    try {
      return moment(value, 'DD-MM-YYYY').toDate();
    } catch (e) {
      return null;
    }
  }
}
