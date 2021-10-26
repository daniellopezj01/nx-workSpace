import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormsGenericService {
  callback = new EventEmitter();

  constructor() {}
}
