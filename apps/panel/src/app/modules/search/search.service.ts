import { RestService } from './../../services/rest/rest.service';
import { Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
} from 'rxjs/operators';
import * as _ from 'lodash';
import { PaginationServiceService } from '../../services/pagination/pagination-service.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public fields = [];
  public filters = [];
  public data$?: Observable<any>;
  public loading = false;
  public src = '';
  private fieldsByKey: any = [];

  constructor(
    private rest: RestService,
    private paginationService: PaginationServiceService
  ) { }

  prepare<T>(callback: () => void): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>): Observable<T> =>
      defer(() => {
        callback();
        return source;
      });
  }

  public find = (data: SourceIn, resetPagination = true) => {
    console.log('entre a find');
    if (data.query !== undefined) {
      this.src = data.query;
    }
    if (resetPagination) {
      this.paginationService.init();
    }
    const url = [
      data.source,
      _.find(this.fieldsByKey, { key: data.source }).fields.join(''),
      `&filter=${this.src}`,
    ];

    url.push(
      `&page=${this.paginationService.page}&limit=${_.find(this.fieldsByKey, { key: data.source }).limit
      }`
    );
    this.data$ = this.rest
      .get(url.join(''), true, { ignoreLoadingBar: '' })
      .pipe(
        map((a) => {
          this.paginationService.totalDocs = a.totalDocs;
          this.paginationService.page = a.page;
          this.paginationService.limit = a.limit;
          this.paginationService.hasPrevPage = a.hasPrevPage;
          this.paginationService.hasNextPage = a.hasNextPage;
          return a;
        }),
        debounceTime(400),
        distinctUntilChanged(),
        this.prepare(() => (this.loading = true)),
        finalize(() => (this.loading = false))
      );
    return this.data$;
  };

  reset = () => {
    this.filters = [];
    this.fields = [];
    this.fieldsByKey = [];
  };

  public setConfig = (data: SourceField) => {
    this.paginationService.init();
    this.fieldsByKey.push({
      key: data.key,
      fields: data.fields,
      limit: data.limit,
    });
  };

  public snipQuery = (pagination: any, params: any = []) => {
    if (params.length) {
      this.fields = params;
    }
    const stringFields = _.map(this.fields, (a) => `${a}`);
    const allParams = `?fields=${stringFields}&filter=${pagination.src}`;
    return allParams;
  };
}

export class SourceIn {
  source?: string;
  query: string | undefined;
}

export class SourceField {
  fields?: string[];
  key?: string;
  limit?: number;
}
