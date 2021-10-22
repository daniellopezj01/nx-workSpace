/* eslint-disable @angular-eslint/component-selector */
import { RestService } from './../../../../services/rest/rest.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import * as _ from 'lodash';
import { SharedService } from '../../../shared/shared.service';
import { ModalsService } from '../../../shared/modals.service';

@Component({
  selector: 'app-modal-activity',
  templateUrl: './modal-activity.component.html',
  styleUrls: ['./modal-activity.component.scss'],
})
export class ModalActivityComponent implements OnInit {
  @Input() public itinerary: any;
  @Input() public activity: any;
  @Input() public updateItem = false;

  public form: FormGroup;
  public data: any = {};
  public changePlace = false;
  public loadingButton = false;
  public isNight = false;

  constructor(
    private formBuilder: FormBuilder,
    private shared: SharedService,
    public modal: ModalsService,
    private rest: RestService
  ) {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    if (this.updateItem) {
      this.formObjectPatch();
    }
  }

  action() {
    this.loadingButton = true;
    if (this.updateItem) {
      this.update();
    } else {
      this.save();
    }
  }

  update() {
    const { details } = this.itinerary;
    const newDetails = _.clone(details);
    const positionActivity = _.findIndex(newDetails, {
      _id: this.activity._id,
    });
    newDetails[positionActivity] = {
      ...this.form.value,
      isNight: this.isNight,
      _id: this.activity._id,
    };
    this.rest
      .patch(`itineraries/${this.itinerary._id}`, { details: newDetails })
      .subscribe((res) => {
        this.itinerary.details = res.details;
        this.rest.toastSuccess(
          'Se ha Actualizado la Actividad exitosamente.',
          'Actividad actualizada'
        );
        this.modal.close();
        this.loadingButton = false;
      });
  }

  async save() {
    const details = _.clone(this.itinerary.details);
    details.push({ ...this.form.value, isNight: this.isNight });
    this.rest
      .patch(`itineraries/${this.itinerary._id}`, { details })
      .subscribe((res) => {
        this.itinerary.details = res.details;
        this.rest.toastSuccess(
          'Se ha creado la actividad exitosamente.',
          'Actividad creada'
        );
        this.modal.close();
        this.loadingButton = false;
      });
  }

  formObjectPatch() {
    const { title, description, isNight } = this.activity;
    this.isNight = isNight;
    this.form.patchValue({
      title: title,
      description: description,
    });
  }
}
