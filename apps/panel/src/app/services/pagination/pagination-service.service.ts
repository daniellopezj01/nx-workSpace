import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { RestService } from '../rest/rest.service';

@Injectable({
  providedIn: 'root',
})
export class PaginationServiceService {
  public src: string = '';
  public totalDocs: number = 0;
  public totalPages: number = 0;
  public page: number = 1;
  public limit: number = 15;
  public paginationConfig = {};
  public morePage: boolean | number = 0;
  public desktop = false;
  public hasPrevPage = false;
  public hasNextPage = false;

  constructor(
    private rest: RestService,
    private shared: SharedService,
    private device: DeviceDetectorService
  ) {
    this.desktop = this.device.isDesktop();
  }

  public init = (data: any = {}) => {
    this.src = '';
    this.page = 1;
    this.limit = data?.limit || 15;
    this.totalDocs = 0;
    this.totalPages = 0;
    this.hasPrevPage = false;
    this.hasNextPage = false;

    this.paginationConfig = {};
    this.morePage = 0;
  };
  /**
   *
   * @param q
   * @param data
   * @param merge
   * @param src
   * @param source
   * @param cbMode
   */
  public paginationData$ = (url) =>
    this.rest.get(url, true).pipe(
      debounceTime(800),
      distinctUntilChanged(),
      map((dataPre) => {
        return dataPre;
      })
    );

  public paginationData = (
    q = [],
    data = [],
    merge = true,
    source = '',
    cbMode = ''
  ) =>
    new Promise((resolve, reject) => {
      this.rest
        .get(q.join(''))
        .pipe(debounceTime(800), distinctUntilChanged())
        .subscribe(
          (res) => {
            data = !this.src.length
              ? [...(merge ? data : []), ...this.shared.parseData(res, source)]
              : [...this.shared.parseData(res, source)];
            resolve({
              data,
              pagination: {
                totalPages: res.totalPages,
                nextPage: res.nextPage,
                prevPage: res.prevPage,
                totalDocs: res.totalDocs,
                limit: res.limit,
              },
            });
          },
          (error) => {
            reject(error);
          }
        );
    });
}
