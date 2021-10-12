import { Component, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalsService } from '../../../core/services/modals.service';
@Component({
  selector: 'app-modal-media',
  templateUrl: './modal-media.component.html',
  styleUrls: ['./modal-media.component.scss'],
})
export class ModalMediaComponent implements OnInit {
  public url: string = '';
  public faTimes = faTimes;
  public modalRef: BsModalRef | undefined;
  constructor(private modals: ModalsService, private library: FaIconLibrary) {
    library.addIcons(faTimes);
  }

  ngOnInit(): void { }

  public close() {
    this.modals.close();
  }
}
