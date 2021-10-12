import { EventEmitter, Injectable, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RestService } from 'apps/front/src/app/core/services/rest.service';

@Injectable({
  providedIn: 'root',
})
export class TextRichService {
  @Output() cbCancelBtn: EventEmitter<any> = new EventEmitter();
  @Output() cbClickAction: EventEmitter<any> = new EventEmitter();
  @Output() mentionUsers = new EventEmitter<any>();
  @Output() userRemoved = new EventEmitter<any>();
  public tmpNameMention = [];
  public addAttachments = [];

  constructor(private rest: RestService,
    private sanitizer: DomSanitizer) { }

  dataURItoBlob(dataURI) {
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

  public loadUser = (name: string = '') =>
    new Promise((resolve, reject) => {
      this.rest
        .get(
          `users?filter=${name.toLowerCase()}&limit=3&sort=name&order=1&fields=name`,
          true,
          { ignoreLoadingBar: '' }
        )
        .subscribe((res) => resolve(this.parseUser(res)));
    })

  private parseUser = (data: any) => {
    try {
      return data.docs.map((u) => {
        return {
          ...u,
          ...{
            id: u._id,
            value: u.name,
            target: JSON.stringify({
              email: u.email,
              name: u.name,
              _id: u._id,
            }),
          },
        };
      });
    } catch (e) {
      return [];
    }
  }

  // public openMentionCb = (template: any, render: any, $event: any) => {
  //   this.openMention = true;
  //   // @ts-ignore
  //   const {x, y, width, height} = $event.currentTarget.getBoundingClientRect();
  //   // @ts-ignore
  //   render.setStyle(template.nativeElement, 'display', 'block');
  //   render.setStyle(template.nativeElement, 'top', `${parseFloat(-20 + height)}px`);
  //   render.setStyle(template.nativeElement, 'left', `${x}px`);
  // };

  // public closeMentionCb = (template: any, render: any) => {
  //   this.openMention = false;
  //   this.tmpNameMention = [];
  //   render.setStyle(template.nativeElement, 'display', 'none');
  // };

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

  public removeFile = (data: any) => {
    this.addAttachments = this.addAttachments.filter(
      (a) => JSON.stringify(a) !== JSON.stringify(data)
    );
  }

  public processFile = async (imageInput: any) => {
    await Promise.all(
      Object.values(imageInput.files).map(($event: File) => {
        const image = this.blobFile($event);
        if (image) {
          this.addAttachments.push(image);
        }
      })
    )
      .then(() => console.log('then'))
      .catch((e) => console.log(e));
  }

  public onPaste($event: ClipboardEvent) {
    // @ts-ignore
    const items = ($event.clipboardData || $event.originalEvent.clipboardData)
      .items;
    let blob = null;
    for (const item of items) {
      console.log(item.type);
      if (item.type.indexOf('image') === 0) {
        blob = item.getAsFile();
        const file = this.blobFile(blob);
        if (file) {
          this.addAttachments.push(file);
        }
      }
    }
  }

  uploadAttachments = (merge = false) =>
    new Promise((resolve, reject) => {
      try {
        const alreadyUploaded = this.addAttachments.filter((a) => a.source);
        if (this.addAttachments.filter((i) => i.blob).length) {
          const formData = new FormData();
          this.addAttachments.forEach((item) =>
            formData.append('file[]', item.blob)
          );
          this.rest.post(`storage`, formData, true, {}).subscribe(
            (res) => {
              if (merge) {
                this.addAttachments = [];
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
    })
}
