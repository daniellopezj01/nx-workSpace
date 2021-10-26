import { Injectable } from '@angular/core';
import { RestService } from '../../../core/services/rest.service';
import { SharedService } from '../../../core/services/shared.service';


@Injectable({
  providedIn: 'root',
})
export class TemplatesHeadersService {
  public allTours: any;
  public continents: any;
  public categories: any;

  public loading = true;
  public loadingContinents = true;

  constructor(private rest: RestService,
    private service: SharedService) {
    this.loadDeals();
    this.loadContinents();
  }

  loadDeals() {
    // this.rest.get('tours?limit=5').subscribe((res:any) => {
    //   this.allTours = res.docs;
    //   this.loading = false;
    //   this.service.loadDataHeaders.emit(this.allTours);
    // });
  }

  loadContinents() {

  }
}
