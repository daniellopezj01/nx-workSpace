import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TripsServiceService {
  public page = 1;
  public limitPerPage = 5;
  private mainData: any;
  public maxSize = 5;
  public firstTime = 0;

  constructor() { }

  trackByMethod(index: number, el: any): number {
    return el._id;
  }
}
