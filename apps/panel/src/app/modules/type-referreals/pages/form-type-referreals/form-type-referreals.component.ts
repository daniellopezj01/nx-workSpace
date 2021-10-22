import { RestService } from './../../../../services/rest/rest.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as _ from 'lodash';


@Component({
  selector: 'app-form-type-referreals',
  templateUrl: './form-type-referreals.component.html',
  styleUrls: ['./form-type-referreals.component.scss']
})
export class FormTypeReferrealsComponent implements OnInit {

  @Input() activeUpdate = false;
  @Input() typeReferreals: any;
  public form: FormGroup;
  public itemsAsObjects = [];
  public planLoading = false;
  public loading = false;
  public userLoading = false;
  public optionsButtons: any = ['save', 'list'];
  public results$?: Observable<any>;
  public id: any = null;
  public data: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private rest: RestService
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      label: ['', Validators.required],
      amountFrom: ['', Validators.required],
      amountTo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
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
  }

  cbList = () => {
    this.router.navigate(['/', 'type-referrals']);
  };

  saveOrEdit() {
    this.loading = true;
    if (this.activeUpdate) {
      this.updatetypeReferreals();
    } else {
      this.savetypeReferreals();
    }
  }

  async savetypeReferreals() {
    let typeReferreals;
    await this.trasnformObject().then((a) => {
      typeReferreals = a;
    });
    this.rest.post(`referredSettings`, typeReferreals).subscribe(
      (res) => {
        this.rest.toastSuccess(
          'Se ha creado el referido exitosamente.',
          'Referido Creado'
        );
        this.loading = false;
        this.router.navigate(['/', 'type-referrals', res._id]);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async updatetypeReferreals() {
    let typeReferreals;
    await this.trasnformObject().then((a) => {
      typeReferreals = a;
    });
    this.rest.patch(`referredSettings/${this.typeReferreals._id}`, typeReferreals).subscribe(
      (res) => {
        this.rest.toastSuccess(
          'Se ha actualizado el tipo de Referido exitosamente.',
          'typo de referido Actualizado'
        );
        this.loading = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  cbTrash() {
    this.rest.delete(`referredSettings/${this.typeReferreals._id}`).subscribe((res) => {
      this.rest.toastSuccess(
        'Se ha Elimando el tipo referido exitosamente.',
        'typo de Referido Eliminada'
      );
      this.router.navigate(['type-referrals']);
    });
  }

  beforeUpdate() {
    this.form.patchValue(this.typeReferreals);
  }

  trasnformObject = () =>
    new Promise((resolve) => {
      const { amountFrom, amountTo } = this.form.value
      const typeReferreals = {
        ...this.form.value,
        amountFrom: parseFloat(amountFrom),
        amountTo: parseFloat(amountTo)
      }
      resolve(typeReferreals);
    });
}
