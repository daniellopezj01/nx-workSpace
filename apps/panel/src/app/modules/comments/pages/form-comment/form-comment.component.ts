import { RestService } from './../../../../services/rest/rest.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { concat, from, Observable, of, Subject } from 'rxjs';

import * as _ from 'lodash';
import { CommentsService } from '../../comments.service';
import { SharedService } from '../../../shared/shared.service';
import { MediaService } from '../../../shared/drop-galery/media.service';

@Component({
  selector: 'app-form-comment',
  templateUrl: './form-comment.component.html',
  styleUrls: ['./form-comment.component.scss']
})
export class FormCommentComponent implements OnInit {
  @Input() activeUpdate = false;
  @Input() comment: any;
  public form: FormGroup;
  public itemsAsObjects = [];
  public loading = false;
  public userLoading = false;
  public categories: any;
  public optionsButtons: any = ['save', 'list'];
  public userInput$ = new Subject<string>();
  public tagsInput$ = new Subject<string>();
  public results$?: Observable<any>;
  public resultsTags$?: Observable<any>;
  public id: any = null;
  public selectLoading = false;
  public data: any = [];
  public ngSelectStatus: any;
  public ngSelectUser: any;
  public ngSelectVote: any;
  public selectTags: any[] = [];
  public statusArray: any = [
    {
      name: 'visible',
      value: 'publish',
    },
    {
      name: 'No visible',
      value: 'draft',
    },
  ];
  public calificactionArray: Array<number> = [1, 2, 3, 4, 5];
  public addTagNowRef: (name: any) => void;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private shared: SharedService,
    public router: Router,
    private rest: RestService,
    public media: MediaService,
    private service: CommentsService
  ) {
    this.addTagNowRef = this.addTagNow.bind(this);
    this.form = this.formBuilder.group({
      idUser: ['', Validators.required],
      tags: [''],
      status: ['', Validators.required],
      vote: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.media.auxFiles = [];
    this.route.params.subscribe((params) => {
      this.id = params.id === 'add' ? '' : params.id;
    });
    this.form.valueChanges.subscribe(() => {
      this.rest.setActiveConfirmLeave = true;
    });
    if (this.activeUpdate) {
      this.beforeUpdate();
      this.optionsButtons.push('trash');
    }
    this.loadInfoSelects()

  }

  loadInfoSelects() {
    this.results$ = this.loadSelect(this.userInput$, 'users');
    this.resultsTags$ = this.loadSelect(this.tagsInput$, 'tags');
  }

  loadSelect(subject: any, type: any) {
    return concat(
      of([]), // default items
      subject.pipe(
        distinctUntilChanged(),
        tap(() => (this.selectLoading = true)),
        switchMap((term: any) =>
          this.singleSearch$(term, type).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.selectLoading = false))
          )
        )
      )
    );
  }

  singleSearch$ = (term: string, typeUrl: string) => {
    let q: any;
    switch (typeUrl) {
      case 'users':
        q = [
          `users?`,
          `filter=${term}`,
          `&fields=name,email,surname`,
          `&page=1&limit=4`,
          `&sort=name&order=-1`,
        ];
        break;
      case 'tags':
        q = [
          `tags?`,
          `filter=${term}`,
          `&fields=name`,
          `&page=1&limit=4`,
          `&sort=name&order=-1`,
        ];
        break;
      default:
        break;
    }
    return this.rest
      .get(q.join(''), true, { ignoreLoadingBar: '' })
      .pipe(map((a) => a.docs));
  };

  cbList = () => {
    this.router.navigate(['/', 'referrals']);
  };

  saveOrEdit() {
    this.loading = true;
    if (this.activeUpdate) {
      this.updateComments();
    } else {
      this.saveComments();
    }
  }

  async saveComments() {
    const comments = await this.trasnformObject()
    this.rest.post(`comments`, comments).subscribe(
      (res: any) => {
        this.rest.toastSuccess(
          'Se ha creado el comentario exitosamente.',
          'comentario Creado'
        );
        this.loading = false;
        this.router.navigate(['/', 'comments', res._id]);
      },
      (err: any) => {
        this.loading = false
      }
    );
  }

  async updateComments() {
    const comments = await this.trasnformObject()
    this.rest.patch(`comments/${this.comment._id}`, comments).subscribe(
      (res: any) => {
        this.rest.toastSuccess(
          'Se ha actualizado el comentario exitosamente.',
          'comentario Actualizado'
        );
        this.loading = false;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  cbTrash() {
    this.rest.delete(`comments/${this.comment._id}`).subscribe((res: any) => {
      this.rest.toastSuccess(
        'Se ha Elimando el comentario exitosamente.',
        'comentario Eliminada'
      );
      this.router.navigate(['/', 'comments']);
    },
      (err: any) => {
        this.loading = false;
        console.log(err);
      });
  }

  beforeUpdate() {
    const newObject = _.clone(this.comment);
    const { status, vote, user, tags } = this.comment;
    this.ngSelectStatus = status;
    this.ngSelectVote = vote;
    this.ngSelectUser = user
    this.selectTags = tags
    this.form.patchValue(newObject);
    if (this.comment?.attachment?.source) {
      this.media.auxFiles = [this.comment?.attachment];
    }
  }

  trasnformObject = async () => {
    let object = {
      ..._.clone(this.form.value),
      idUser: this.ngSelectUser._id,
    }
    if (this.media?.auxFiles?.length) {
      await this.media.loadImages().then((res: any) => {
        const attachment = _.head(res);
        object = { ...object, attachment };
      });
    } else {
      object = { ...object, attachment: {} };
    }
    return object
  };

  addTagNow(name: any): any {
    return new Promise((resolve) => {
      const object = { name }
      this.selectLoading = true;
      this.rest.post('tags', object).subscribe(
        (res: any) => {
          this.selectLoading = false
          resolve(object)
        },
        (err: any) => {
          this.selectLoading = false
          this.rest.showToast('')
        })
    })
  }
}
