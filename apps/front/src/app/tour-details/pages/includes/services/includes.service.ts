import { Injectable } from '@angular/core';
import { ModalsService } from 'apps/front/src/app/core/services/modals.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MoreInfoComponent } from '../../../components/more-info/more-info.component';

@Injectable({
  providedIn: 'root',
})
export class IncludesService {
  modalRef: BsModalRef | undefined;

  constructor(private modalService: ModalsService) { }

  moreInfo(data: any = {}) {
    this.modalService.openComponent({ data }, MoreInfoComponent, 'modal-md');
  }

  closeModal() {
    this.modalService.close();
  }
}
