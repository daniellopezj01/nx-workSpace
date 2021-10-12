import { Component, OnInit } from '@angular/core';
import { ModalsService } from '../../../core/services/modals.service';

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.scss'],
})
export class MoreInfoComponent implements OnInit {
  public data: any;

  constructor(private modalService: ModalsService) { }

  ngOnInit(): void { }

  closeModal() {
    this.modalService.close();
  }
}
