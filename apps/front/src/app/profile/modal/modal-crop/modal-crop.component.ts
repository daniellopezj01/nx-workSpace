import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { ModalCropMediaService } from '../modal-crop-media.service';
import { Options } from '@angular-slider/ngx-slider';
import { finalize } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-modal-crop',
  templateUrl: './modal-crop.component.html',
  styleUrls: ['./modal-crop.component.scss'],
})
export class ModalCropComponent implements OnInit, OnDestroy {
  public data: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  scale = 1;
  optionZoom: Options = {
    floor: 1,
    ceil: 6,
    step: 0.1,
    animate: true,
  };
  loading = false;

  transform: ImageTransform = {};
  public listSubscribers: any = [];
  public user: any;

  constructor(
    private modalCropMediaService: ModalCropMediaService,
    private restService: RestService,
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {
    this.user = this.restService.getCurrentUser();
    this.listObserver();
  }

  ngOnDestroy() {
    this.listSubscribers.forEach((a) => a.unsubscribe());
  }

  listObserver = () => {
    const observer1$ = this.modalCropMediaService.eventIn.subscribe((res) => {
      this.imageChangedEvent = res;
    });

    const observer2$ = this.modalCropMediaService.dataIn.subscribe((res) => {
      this.croppedImage = res.base64;
    });

    this.listSubscribers = [observer1$, observer2$];
  }

  zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  changeZoom(event) {
    this.scale = event?.value;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  saveImage() {
    this.loading = true;
    const file = this.modalCropMediaService.dataURItoBlob(this.croppedImage);
    this.modalCropMediaService
      .uploadImage(file)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: any) => {
        this.modalCropMediaService.saveProfileImage.emit(res);
        const resParse = JSON.parse(res) || null;
        if (resParse && resParse?.body) {
          this.bsModalRef.hide();
        }
      });
  }
}
