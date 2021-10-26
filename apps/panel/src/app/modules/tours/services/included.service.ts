import { EventEmitter, Injectable } from '@angular/core';
import { RestService } from '../../../services/rest/rest.service';

@Injectable({
  providedIn: 'root',
})
export class IncludedService {
  callback = new EventEmitter();

  constructor(private rest: RestService) {}

  updateIncluded = (id: string, data: any) => {
    return this.rest.patch(`tours/${id}`, data);
  };

  saveIncluded = (data: any) => {
    return this.rest.post(`tours`, data);
  };

  deleteIncluded = (id: string) => {
    return this.rest.delete(`tours/${id}`);
  };
}
