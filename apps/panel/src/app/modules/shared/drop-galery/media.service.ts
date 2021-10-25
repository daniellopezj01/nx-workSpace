import { EventEmitter, Injectable, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RestService } from '../../../services/rest/rest.service';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  @Output() deleteImage = new EventEmitter<any>();
  public files: any = [];
  public auxFiles: any = [];
  public activeAux = false;

  public items: any = [];

  constructor(
    private rest: RestService,
    private sanitizer: DomSanitizer
  ) { }

  public processFile = async (imageInput: any) => {
    await Promise.all(
      Object.values(imageInput.files).map(async ($event: any) => {
        const image = await this.blobFile($event);
        if (image) {
          if (this.activeAux) {
            this.auxFiles.push(image);
          } else {
            this.files.push(image);
          }
        }
      })
    )
      .then(() => console.log('then'))
      .catch((e) => console.log(e));
  };

  public toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  blobFile = async ($event: any) =>
    new Promise((resolve) => {
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
          resolve({
            blob: $event,
            image,
            base: null,
          });
        };
      } catch (e) {
        console.log(e)
      }
    });

  loadImages = (merge = false) =>
    new Promise((resolve, reject) => {
      try {
        const filesToSend = this.activeAux ? this.auxFiles : this.files;
        const alreadyUploaded = filesToSend.filter(
          (a: any) => a.source?.original || typeof a === 'string'
        );
        if (filesToSend.filter((i: any) => i.blob).length) {
          const formData = new FormData();
          filesToSend.forEach((item: any) => {
            if (item.blob) {
              formData.append('file[]', item.blob);
            }
          });
          this.rest.post(`storage`, formData, true, {}).subscribe(
            (res: any) => {
              if (merge) {
                if (this.activeAux) {
                  this.auxFiles = [];
                } else {
                  this.files = [];
                }
              }
              resolve([...alreadyUploaded, ...res]);
            },
            () => {
              reject([...alreadyUploaded]);
            }
          );
        } else {
          resolve([...alreadyUploaded]);
        }
      } catch (e) {
        resolve([]);
      }
    });
}
