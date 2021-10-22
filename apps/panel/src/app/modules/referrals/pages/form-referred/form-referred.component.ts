import { RestService } from './../../../../services/rest/rest.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import {ModalUserComponent} from "../modal-user/modal-user.component";
import {
  catchError,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { concat, from, Observable, of, Subject } from 'rxjs';
import * as _ from 'lodash';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-form-referred',
  templateUrl: './form-referred.component.html',
  styleUrls: ['./form-referred.component.scss'],
})
export class FormReferredComponent implements OnInit {
  @Input() activeUpdate = false;
  @Input() referred: any;
  public form: FormGroup;
  public itemsAsObjects = [];
  public planLoading = false;
  public loading = false;
  public activePlan = false;
  public userLoading = false;
  public optionsButtons: any = ['save', 'list'];
  public userInput$ = new Subject<string>();
  public planInput$ = new Subject<string>();
  public results$?: Observable<any>;
  public id: any = null;
  public data: any = [];
  public resultsPlan$?: Observable<any>;
  public ngSelectFrom: any;
  public ngSelectPlan: any;
  public ngSelectTo: any;
  public ngSelectStatus: any;
  public statusArray: any = [
    {
      name: 'Pendiente',
      value: 'available',
    },
    {
      name: 'Completado',
      value: 'unavailable',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private shared: SharedService,
    public router: Router,
    private rest: RestService
  ) {
    this.form = this.formBuilder.group({
      userFrom: ['', Validators.required],
      userTo: ['', Validators.required],
      planReferred: ['', Validators.required],
      amountFrom: ['', Validators.required],
      amountTo: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {


    this.route.params.subscribe((params) => {
      this.id = params.id === 'add' ? '' : params.id;
    });
    this.form.valueChanges.subscribe(() => {
      this.rest.setActiveConfirmLeave = true;
    });
    this.loadUsers();
    this.loadPlanReferred();
    if (this.activeUpdate) {
      this.beforeUpdate();
      this.optionsButtons.push('trash');
    }
  }

  private loadUsers() {
    this.results$ = concat(
      of([]), // default items
      this.userInput$.pipe(
        distinctUntilChanged(),
        tap(() => (this.userLoading = true)),
        switchMap((term) =>
          this.singleSearch$(term, 'users').pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.userLoading = false))
          )
        )
      )
    );
  }
  private loadPlanReferred() {
    this.resultsPlan$ = concat(
      of([]), // default items
      this.planInput$.pipe(
        distinctUntilChanged(),
        tap(() => (this.planLoading = true)),
        switchMap((term) =>
          this.singleSearch$(term, 'plan').pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.planLoading = false))
          )
        )
      )
    );
  }

  singleSearch$ = (term: any, typeUrl: any) => {
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
      case 'plan':
        q = [
          `referredSettings?`,
          `filter=${term}`,
          `&fields=name,label`,
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

  selectPlan(e: any) {
    if (e?._id) {
      this.activePlan = true;
      this.form.patchValue(e);
    } else {
      this.activePlan = false;
      this.form.patchValue({
        amountFrom: null,
        amountTo: null,
      });
    }
  }

  cbList = () => {
    this.router.navigate(['/', 'referrals']);
  };

  saveOrEdit() {
    this.loading = true;
    if (this.activeUpdate) {
      this.updateReferred();
    } else {
      this.saveReferred();
    }
  }

  async saveReferred() {
    let referred;
    await this.trasnformObjectSave().then((a) => {
      referred = a;
    });
    this.rest.post(`referreds`, referred).subscribe(
      (res) => {
        this.rest.toastSuccess(
          'Se ha creado el referido exitosamente.',
          'Referido Creado'
        );
        this.loading = false;
        this.router.navigate(['/', 'referrals', res._id]);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async updateReferred() {
    let referred;
    await this.trasnformObjectUpdate().then((a) => {
      referred = a;
    });
    this.rest.patch(`referreds/${this.referred._id}`, referred).subscribe(
      (res) => {
        this.rest.toastSuccess(
          'Se ha actualizado el Referido exitosamente.',
          'Referido Actualizado'
        );
        this.loading = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  cbTrash() {
    this.rest.delete(`referreds/${this.referred._id}`).subscribe((res) => {
      this.rest.toastSuccess(
        'Se ha Elimando el referido exitosamente.',
        'Referido Eliminada'
      );
      this.router.navigate(['/referrals']);
    });
  }

  beforeUpdate() {
    const newObject = _.clone(this.referred);
    const { userTo, userFrom, plan, status } = this.referred;
    this.ngSelectStatus = status;
    this.ngSelectFrom = userFrom;
    this.ngSelectTo = userTo;
    this.ngSelectPlan = plan;
    if (plan) {
      this.activePlan = true;
    }
    delete newObject.userFrom;
    this.form.patchValue(newObject);
  }

  trasnformObjectSave = () =>
    new Promise((resolve) => {
      const referred = _.clone(this.form.value);
      const { userTo, planReferred, userFrom } = this.form.value;
      referred.userTo = userTo._id;
      referred.planReferred = planReferred._id;
      referred.userFrom = userFrom._id;
      resolve(referred);
    });

  trasnformObjectUpdate = () =>
    new Promise((resolve) => {
      const referred = _.clone(this.form.value);
      const { userTo, planReferred, userFrom } = this.form.value;
      referred.userTo = userTo._id || this.referred.userTo._id;
      referred.planReferred =
        planReferred._id || this.referred.planReferred._id;
      referred.userFrom = userFrom._id || this.referred.userFrom._id;
      resolve(referred);
    });
}
