import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { ModalsService } from 'apps/front/src/app/core/services/modals.service';

@Injectable({
  providedIn: 'root',
})
export class ToursService {
  public page: number = 1;
  public limitPerPage: number = 12;
  public maxSize: number = 5;
  public rawData: any = [];
  changeFilters = new EventEmitter<any>();
  dataLoaded = new EventEmitter<any>();
  sharedNumberTotalDocs = new EventEmitter<any>();

  public arrayParms: any = ['query', 'continent', 'minPrice', 'maxPrice', 'offeredBy', 'category', 'minAge', 'maxAge', 'minDate', 'maxDate', 'language', 'minDuration', 'maxDuration']

  constructor(private modals: ModalsService) { }

  trackByMethod(index: number, el: any): number {
    return el._id;
  }
  closeModal() {
    this.modals.close();
  }
}
