import { EventEmitter, Injectable, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RestService } from '../../core/services/rest.service';

@Injectable({
  providedIn: 'root',
})
export class ModalCropMediaService {
  eventIn = new EventEmitter<any>();
  dataIn = new EventEmitter<any>();
  saveProfileImage = new EventEmitter<any>();

  constructor(
    private sanitizer: DomSanitizer,
    private rest: RestService,
    private http: HttpClient
  ) { }

  blobFile = ($event: any) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      return {
        blob: $event,
        image,
      };
    } catch (e) {
      return null;
    }
  }

  dataURItoBlob(dataURI: any) {
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  saveProfile = () => {
    // const form = new FormData();
    // form.append('file[]', fileItem.file);
    // const api = `${environment.api}/storage`;
    // const req = new HttpRequest('POST', api, form, {
    //   reportProgress: true,
    //   // headers: this.headers(),
    // });
    //
    // return this.http.request(req).pipe(
    //   map((res: HttpEvent<any>) => {
    //     return JSON.stringify(res);
    //   })
    // );
  }

  uploadImage(file: any) {
    const form = new FormData();
    form.append('file[]', file);
    const api = `${environment.api}/storage`;
    const req = new HttpRequest('POST', api, form, {
      reportProgress: true,
      // headers: this.headers(),
    });

    return this.http.request(req).pipe(
      map((res: HttpEvent<any>) => {
        return JSON.stringify(res);
      })
    );
  }
}
