import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FilterComponent } from '../filter/filter.component';
import { catchError, finalize, map, tap, filter } from 'rxjs/operators';
import { MainSearchService } from '../../main-search.service';
import { throwError, Subscription } from 'rxjs';
import { ToursService } from '../services/tours.service';
import { ModalsService } from 'apps/front/src/app/core/services/modals.service';
import { RestService } from 'apps/front/src/app/core/services/rest.service';

@Component({
  selector: 'app-container-tour',
  templateUrl: './container-tour.component.html',
  styleUrls: ['./container-tour.component.scss'],
})
export class ContainerTourComponent implements OnInit, OnDestroy {
  response: any = {};
  data: any = [];
  loading: boolean = false;
  nextPage: boolean = false;
  emptyResults: boolean = false;
  public listSubscribers: any = [];
  public data$: Array<any> = [];
  public currentParams: string = '';
  public totalDocs: number = 0
  public percentage: number = 0

  constructor(
    private modalService: ModalsService,
    private rest: RestService,
    public tourService: ToursService,
    private mainSearchService: MainSearchService,
  ) { }

  ngOnInit(): any {
    this.getDataFirstTime()
    this.listObserver();
  }

  getDataFirstTime() {
    this.mainSearchService.getParamsKey()
    this.currentParams = this.mainSearchService.paramsToUrl()
    this.getData(1)
  }

  public get objectparams() {
    return this.mainSearchService.getGlobalParams
  }

  listObserver = () => {
    const observer1$ = this.tourService.changeFilters.subscribe(() => {
      this.data$ = []
      this.currentParams = this.mainSearchService.paramsToUrl()
      this.getData(1)
    });
    this.listSubscribers.push(observer1$);
  }

  ngOnDestroy() {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }

  getData(page: any = null) {
    this.tourService.page = page || 1;
    this.loading = true;
    const url = [
      `tours?limit=${this.tourService.limitPerPage}`,
      `&page=${this.tourService.page}`,
      `${this.currentParams ? '&' + this.currentParams : ''}`
    ].join('');
    this.rest
      .get(url)
      .pipe(
        tap((a) => {
          this.response = a;
          this.nextPage = a.nextPage;
          this.totalDocs = a.totalDocs;
        }),
        map((b) => b.docs),
        tap(() => (this.loading = false)),
        catchError((err) => {
          console.log(err)
          this.loading = err;
          return throwError(err);
        })
      )
      .subscribe((res: any) => {
        this.tourService.sharedNumberTotalDocs.emit(this.response.totalDocs)
        this.data$ = res ? [...this.data$, ...res] : []
        this.percentage = this.data$.length / this.totalDocs * 100
      });
  }

  seeAllTrips() {
    this.mainSearchService.removeParms(this.tourService.arrayParms, this.tourService)
  }

  moreData() {
    if (this.nextPage) {
      this.getData(this.tourService.page + 1);
    }
  }

  openFilters() {
    this.modalService.openComponent({ tripsNumber: this.response.totalDocs }, FilterComponent, 'modal-filters');
  }

  onScroll() { }

  clearFilters() {
    this.mainSearchService.removeParms(this.tourService.arrayParms, this.tourService)
  }
}
