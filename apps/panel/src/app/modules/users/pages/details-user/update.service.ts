import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  public showInfo = false;
  public activeLoading = false;
  @Output() cookieUser: EventEmitter<any> = new EventEmitter();

  constructor() {}

  public show() {
    this.showInfo = true;
  }

  public hide() {
    this.showInfo = false;
  }

  public showLoading() {
    this.activeLoading = true;
  }

  public hideLoading() {
    this.activeLoading = false;
  }
  public get getShowInfo(): boolean {
    return this.showInfo;
  }

  emitUser() {
    this.cookieUser.emit();
  }
  unsubscribeUser() {
    this.cookieUser.unsubscribe();
  }
}
