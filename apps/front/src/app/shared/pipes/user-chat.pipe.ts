import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'userChat',
})
export class UserChatPipe implements PipeTransform {
  transform(value: any, args: any): any {
    try {
      return _.find(value, { _id: args });
    } catch (e) {
      return null;
    }
  }
}
