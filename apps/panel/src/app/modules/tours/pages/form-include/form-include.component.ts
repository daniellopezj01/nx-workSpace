import { RestService } from './../../../../services/rest/rest.service';
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { FormsGenericService } from '../../services/forms-generic.service';
import { ModalsService } from '../../../shared/modals.service';
import { MediaService } from '../../../shared/drop-galery/media.service';

@Component({
  selector: 'app-form-include',
  templateUrl: './form-include.component.html',
  styleUrls: ['./form-include.component.scss'],
})
export class FormIncludeComponent implements OnInit {
  @Input() tour: any;
  @Input() item: any;
  @Input() type: any;
  @Input() updateItem = false;

  public form: FormGroup;
  public data: any = {};
  public loadingButton = false;
  public loading = false;
  public isFeatured = false;

  constructor(
    public media: MediaService,
    private formBuilder: FormBuilder,
    public modal: ModalsService,
    private rest: RestService,

    private formsGenericService: FormsGenericService
  ) {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.min(0)]],
      image: [Validators.required],
    });
  }

  ngOnInit(): void {
    this.media.auxFiles = [];

    this.formObjectPatch();
  }

  async onSubmit(): Promise<any> {
    const { _id } = this.tour;
    this.loading = true;
    const body = await this.checkTypeForm();
    this.rest
      .patch(`tours/${_id}`, body)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.formsGenericService.callback.emit({ type: this.type, item: res });
        this.modal.close();
        this.rest.toastSuccess(
          `${this.type} Creada`,
          `Se ha creado exitosamente el/la ${this.type}`
        );
        this.type = null;
      });
  }

  checkTypeForm = async () => {
    let arrayItems = this.tour[this.type] || [];
    const positionItem = _.findIndex(arrayItems, {
      _id: this.item?._id,
    });
    if (positionItem >= 0) {
      arrayItems[positionItem] = {
        ...this.form.value,
        isFeatured: this.isFeatured,
        _id: this.item?._id,
      };
      if (this.type && this.media.auxFiles.length) {
        await this.media.loadImages().then((res: any) => {
          const image = _.head(res);
          arrayItems[positionItem] = {
            ...arrayItems[positionItem],
            image,
          };
        });
      }
    } else {
      let object = { ...this.form.value, isFeatured: this.isFeatured };
      if (this.type && this.media.auxFiles.length) {
        await this.media.loadImages().then((res: any) => {
          const image = _.head(res);
          object = { ...object, image };
        });
      }
      arrayItems = [...arrayItems, ...[object]];
    }
    const arrayToUpdate = { [this.type]: arrayItems };
    return arrayToUpdate;
  };

  formObjectPatch(): any {
    const { title, description, isFeatured } = this.item || {};
    this.isFeatured = isFeatured;
    this.form.patchValue({
      title,
      description,
    });
    if (this.item && this.item.image) {
      this.media.auxFiles = [this.item.image];
    }
  }

  updateValuesFromApi(res: any) {
    console.log('updateValuesFromApi');
    this.modal.close();
    const { included, notIncluded, faq } = res;
    this.tour.included = included;
    this.tour.notIncluded = notIncluded;
    this.tour.faq = faq;
    this.loadingButton = false;
  }

  checkPropertyObject = (array: any) => new Promise((resolve) => { console.log('') });

  // async update() {
  //   const arrayItems = _.clone(
  //     this.tour[this.type ? 'included' : 'notIncluded']
  //   );
  //   const positionItem = _.findIndex(arrayItems, {
  //     _id: this.item._id,
  //   });
  //   arrayItems[positionItem] = {
  //     ...this.form.value,
  //     _id: this.item._id,
  //   };
  //   if (this.type && this.media.auxFiles.length) {
  //     await this.media.loadImages().then((res: any) => {
  //       const image = _.head(res);
  //       arrayItems[positionItem] = {
  //         ...arrayItems[positionItem],
  //         image,
  //       };
  //     });
  //   }
  //   const sendObject = {};
  //   sendObject[this.type ? 'included' : 'notIncluded'] = arrayItems;
  //   this.rest.patch(`tours/${this.tour._id}`, sendObject).subscribe((res) => {
  //     this.rest.toastSuccess(
  //       'Se ha Actualizado la Actividad exitosamente.',
  //       'Actividad actualizada'
  //     );
  //     this.bsModalRef.hide();
  //     this.tour.included = res.included;
  //     this.tour.notIncluded = res.notIncluded;
  //     this.loadingButton = false;
  //     this.media.auxFiles = [];
  //   });
  // }
  //
  // async save() {
  //   const array = _.clone(this.tour[this.type ? 'included' : 'notIncluded']);
  //   const object = this.form.value;
  //   if (this.media.auxFiles.length && this.type) {
  //     await this.media.loadImages().then((res: any) => {
  //       object.image = _.head(res);
  //     });
  //   }
  //   array.push(object);
  //   const sendObject = {};
  //   sendObject[this.type ? 'included' : 'notIncluded'] = array;
  //   this.rest.patch(`tours/${this.tour._id}`, sendObject).subscribe((res) => {
  //     this.rest.toastSuccess(
  //       'Se ha creado la actividad exitosamente.',
  //       'Actividad creada'
  //     );
  //     this.bsModalRef.hide();
  //     this.loadingButton = false;
  //     this.tour.included = res.included;
  //     this.tour.notIncluded = res.notIncluded;
  //     this.media.auxFiles = [];
  //   });
  // }
  //
  // checkString(): any {
  //   const str = 'TOUR.INCLUDES.';
  //   switch (this.type) {
  //     case 'notIncluded':
  //       return `${str}${!this.updateItem ? 'NEW_INCLUDE' : 'UPDATE_INCLUDE'}`;
  //     case 'included':
  //       return `${str}${!this.updateItem ? 'NEW_NOT_INCLUDE' : 'UPDATE_NOT_INCLUDE'}`;
  //   }
  // }
}
