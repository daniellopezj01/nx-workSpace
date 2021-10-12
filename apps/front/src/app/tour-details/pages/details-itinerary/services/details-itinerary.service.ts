import { EventEmitter, Injectable } from '@angular/core';
import { ModalsService } from 'apps/front/src/app/core/services/modals.service';

@Injectable({
  providedIn: 'root',
})
export class DetailsItineraryService {
  public activeActionCity: boolean = false;
  public listenActionCity = new EventEmitter<any>();
  public eventViewPort = new EventEmitter<any>();

  constructor(private modal: ModalsService) { }

  public setbooleanCity(active: boolean) {
    this.activeActionCity = active;
  }
  public get getbooleanCity() {
    return this.activeActionCity;
  }

  close() {
    this.modal.close();
  }
}
