import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'striphtml',
})
export class StriphtmlPipe implements PipeTransform {
  transform(value: string = '', args: any = null): any {
    try {
      if (args === 'link') {
        let replacedText;
        let replacePattern1;
        let replacePattern2;

        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = value.replace(
          replacePattern1,
          '<a href="$1" class="linkified"  target="_blank">$1</a>'
        );

        // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(
          replacePattern2,
          '$1<a class="linkified" href="http://$2" target="_blank">$2</a>'
        );
        return replacedText;
      } else {
        // console.log('AA')
        return value.replace(/<.*?>/g, ''); // replace tags
      }
    } catch (e) {
      return null;
    }
  }
}
