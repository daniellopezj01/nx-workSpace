import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputSearchService {
  public globalFocusSearch = false;
  public activeSmallTemplate = false;



  public setGlobalFocusSearch(value: boolean) {
    this.globalFocusSearch = value
  }

  public get getGlobalFocusSearch(): boolean {
    return this.globalFocusSearch
  }
  public setActiveSmallTemplateh(value: boolean) {
    this.activeSmallTemplate = value
  }

  public get getActiveSmallTemplate(): boolean {
    return this.activeSmallTemplate
  }

}
