import { Component, Input, OnInit } from '@angular/core';
import { ModalsService } from 'apps/front/src/app/core/services/modals.service';

@Component({
  selector: 'app-main-modal-map-itinerary',
  templateUrl: './main-modal-map-itinerary.component.html',
  styleUrls: ['./main-modal-map-itinerary.component.scss'],
})
export class MainModalMapItineraryComponent implements OnInit {
  @Input() tour: any;

  constructor(private modalService: ModalsService) { }

  ngOnInit(): void { }

  closeModal() {
    this.modalService.close();
  }
}
