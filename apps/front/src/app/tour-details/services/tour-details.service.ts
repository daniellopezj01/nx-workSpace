import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TourDetailsService {
  navigationTour = new EventEmitter<any>();
  sectionTour = new EventEmitter<any>();

  constructor() {}
}
