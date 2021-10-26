import { Injectable, EventEmitter } from '@angular/core';
import { RestService } from '../../../services/rest/rest.service';

@Injectable({
  providedIn: 'root',
})
export class ItineraryService {
  callback = new EventEmitter<any>();

  constructor(private rest: RestService) {}

  updateItinerary = (id: string, data: any) => {
    return this.rest.patch(`itineraries/${id}`, data);
  };

  saveItinerary = (data: any) => {
    return this.rest.post(`itineraries`, data);
  };

  deleteItinerary = (id: string) => {
    return this.rest.delete(`itineraries/${id}`);
  };
}
