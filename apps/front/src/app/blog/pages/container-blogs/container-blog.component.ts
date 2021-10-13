import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { catchError, finalize, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-container-blogs',
  templateUrl: './container-blog.component.html',
  styleUrls: ['./container-blog.component.scss'],
})
export class ContainerBlogComponent implements OnInit {
  public data: any;
  public loading?: boolean;

  constructor(
    private rest: RestService,
    private active: ActivatedRoute,
    public translate: TranslateService,
    public datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    const blog = this.active.snapshot.params.id;
    this.loadData(blog);
  }

  loadData(blog: any): any {
    this.loading = true;
    this.rest
      .get(`blogs/${blog}`)
      .pipe(
        tap(() => (this.loading = false)),
        catchError((err) => {
          this.loading = err;
          return throwError(err);
        })
      )
      .subscribe((res) => {
        this.data = res;
      });
  }
}
