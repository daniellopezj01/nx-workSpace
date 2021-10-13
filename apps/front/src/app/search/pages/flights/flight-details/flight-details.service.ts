import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlightDetailsService {
  private infoFlight: any;

  constructor() { }

  public setInfoflight(dataFlight: any) {
    this.infoFlight = dataFlight;
  }

  public get getInfoFlight(): string {
    return this.infoFlight
  }

}
