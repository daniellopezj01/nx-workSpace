import { ModalsService } from './../../../../core/services/modals.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-stops',
  templateUrl: './modal-stops.component.html',
  styleUrls: ['./modal-stops.component.scss'],
})
export class ModalStopsComponent {
  @Input() stops: any = [];
  private sizeLogo = '80';
  constructor(private modalService: ModalsService) { }

  getAeroline(flight: any) {
    return `http://pics.avs.io/${this.sizeLogo}/${this.sizeLogo}/${flight.marketing_carrier}.png`;
  }

  closeModal() {
    this.modalService.close();
  }

  getStringLocation(item: any, isDeparture = true) {
    const objectLocation =
      item[`${isDeparture ? 'departureLocation' : 'arrivalLocation'}`];
    return `(${objectLocation.city_code}) ${objectLocation.city}-${objectLocation.country}`;
  }
}
