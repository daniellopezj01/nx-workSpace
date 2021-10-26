import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DetailsTourService {
  @Output() tax = new EventEmitter<any>();
  @Output() taxOffset = new EventEmitter<any>();
  @Output() generalSave = new EventEmitter<any>();
  constructor() {}
}
