import { RestService } from './../../../services/rest/rest.service';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MediaVideoService {
  @Output() deleteVideo = new EventEmitter<any>();
  public files: any = [];
  public items: any = [];

  constructor(
    private rest: RestService,
    private sanitizer: DomSanitizer
  ) { }

  public processFile = async (videoInput: any) => {
    await Promise.all(
      Object.values(videoInput.files).map(async ($event: any) => {
        const video = await this.blobFile($event);
        if (video) {
          this.files.push(video);
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

  loadVideo = (merge = false) =>
    new Promise((resolve, reject) => {
      try {
        const alreadyUploaded = this.files.filter(
          (a: any) => a.source?.original || typeof a === 'string'
        );
        if (this.files.filter((i: any) => i.blob).length) {
          const formData = new FormData();
          this.files.forEach((item: any) => {
            if (item.blob) {
              formData.append('file[]', item.blob);
            }
          });
          this.rest.post(`storage`, formData, true, {}).subscribe(
            (res: any) => {
              if (merge) {
                this.files = [];
              }
              resolve([...alreadyUploaded, ...res]);
            },
            (error) => {
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
