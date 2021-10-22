import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root',
})
export class ModalsService {
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) {}

  close() {
    this.modalRef.hide();
  }

  openComponent(
    data: any,
    componet: any,
    className: string,
    ignoreBack = true
  ): any {
    this.modalRef = this.modalService.show(componet, {
      class: className,
      initialState: data,
      ignoreBackdropClick: ignoreBack,
      // animated: false,
    });
  }
}
