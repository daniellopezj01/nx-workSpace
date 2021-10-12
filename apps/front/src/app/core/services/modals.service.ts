import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Injectable({
  providedIn: 'root',
})
export class ModalsService {
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  openVideo(data: string, componet: any) {
    this.modalRef = this.modalService.show(componet, {
      class: 'modal-video',
      initialState: {
        url: data,
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  openComponent(
    data: any,
    componet: any,
    className: string,
    ignoreBack = false
  ) {
    this.modalRef = this.modalService.show(componet, {
      class: className,
      initialState: data,
      animated: false,
      ignoreBackdropClick: ignoreBack,
    });
  }
}
