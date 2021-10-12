import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class MainSearchService {
  public qParam = '';
  public mainParam = '';
  public cityParam: any = '';
  public globalParams: Params = {};
  public navigationSubscription: any;
  public currencySymbol?: string;
  public generalParamsString: any;
  /** params structure
   * A: Buscar en Tours
   * B: Buscador de apis de vuelos y hoteles
   * C: ID de ciudad vuelos o hoteles
   * D: Rango de fechas
   * E: Numero de adultos
   * F: Numero niños
   * G: Codigo de Aeropuerto de XXX_XXX separador por _
   * H: Divisa
   * continent: Continente para los tours
   * category: Categoria de tours
   * L: Precio tour
   * duration: Duracion Tour
   * N: Rango de rechas Tour
   * language: Language tour
   */


  constructor(
    private active: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.globalParams = this.active.snapshot.queryParams;
  }

  clearParams() {
    this.globalParams = {}
  }

  public get getGlobalParams(): Params {
    return this.globalParams;
  }

  public flattenQuery(data = {}): any {
    return data
  }

  paramsToUrl(): string {
    let url = ''
    _.map(_.entries(this.globalParams), i => {
      url = `${url}${i[0]}=${i[1]}&`
    })
    return url.slice(0, -1)
  }

  setParams(newParams = {}, service: any) {
    this.globalParams = { ...this.globalParams, ...newParams }
    this.updateQueryURI(service)
  }

  removeParms(arrayProperties = [], service: any) {
    this.globalParams = _.omit(this.globalParams, arrayProperties)
    this.updateQueryURI(service)
  }

  public getParamsKey(): any {
    try {
      this.globalParams = this.active.snapshot.queryParams;
      return this.globalParams;
    } catch (e) {
      return this.globalParams
    }
  }

  private updateQueryURI(service: any = null) {
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: this.globalParams,
        queryParamsHandling: '', // remove to replace all query params by provided
      })
      .then(() => {
        if (service) {
          service.changeFilters.emit(this.globalParams);
        }
      });
  }
}
