import { EventEmitter, Injectable, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { reject } from 'lodash';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  @Output() deleteImage = new EventEmitter<any>();
  public files: any = [];
  public items: any = [];

  constructor(private rest: RestService, private sanitizer: DomSanitizer) { }

  public processFile = async (imageInput: any) => {
    await Promise.all(
      Object.values(imageInput.files).map(async ($event: any) => {
        const image = await this.blobFile($event);
        if (image) {
          this.files.push(image);
        }
      })
    )
      .then(() => console.log('then'))
      .catch((e) => console.log(e));
  }

  public toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    })

  blobFile = async ($event: any) =>
    new Promise((resolve, reject) => {
      try {
        const unsafeImg = window.URL.createObjectURL($event);
        const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
        const reader = new FileReader();
        reader.readAsDataURL($event);
        reader.onload = () => {
          resolve({
            blob: $event,
            image,
            base: reader.result,
          });
        };
        reader.onerror = (error) => {
          console.log(error);
          resolve({
            blob: $event,
            image,
            base: null,
          });
        };
        reject({})
      } catch (e) {
        console.log(e);
        reject({})
      }
    })

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

  loadImages = (arrayImages: any) =>
    new Promise((resolve, reject) => {
      try {
        const formData = new FormData();
        arrayImages.forEach((item: any) => {
          formData.append('file[]', item);
        });
        this.rest.post(`storage`, formData, true, {}).subscribe(
          (res) => {
            resolve([...res]);
          },
          (error) => {
            console.log(error);
          }
        );
      } catch (e) {
        resolve([]);
      }
    })
}
