import { Component, Input, OnInit } from '@angular/core';
import { ModalsService } from '../../../core/services/modals.service';

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss'],
})
export class ModalAlertComponent implements OnInit {
  @Input() message: any;

  constructor(private modalService: ModalsService) { }

  ngOnInit(): void { }

  closeModal() {
    this.modalService.close();
  }
}
