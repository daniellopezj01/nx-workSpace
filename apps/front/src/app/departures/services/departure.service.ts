import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DepartureService {

  public page = 1;
  public limitPerPage = 3;
  private mainData: any;
  public maxSize = 3;
  public firstTime = 0;

  selectItem = new EventEmitter<any>();
  nextStep = new EventEmitter<any>();
  activeSession = new EventEmitter<any>();
  goToReservation = new EventEmitter<any>();
  selectIndexPercentage: any = 0;

  constructor() { }

  trackByMethod(index: number, el: any): number {
    return el._id;
  }
}
