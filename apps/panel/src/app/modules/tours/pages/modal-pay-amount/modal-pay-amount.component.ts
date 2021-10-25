/* eslint-disable @angular-eslint/component-selector */
import { RestService } from './../../../../services/rest/rest.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import _ from 'lodash';
import moment from 'moment';
import { ModalsService } from '../../../shared/modals.service';

@Component({
  selector: 'app-modal-pay-amount',
  templateUrl: './modal-pay-amount.component.html',
  styleUrls: ['./modal-pay-amount.component.scss'],
})
export class ModalPayAmountComponent implements OnInit {
  @Input() setting: any;
  @Input() departure: any;
  @Input() discount: any;
  @Input() updateItem = false;
  public form: FormGroup;
  public data: any = {};
  public today = moment().toDate();
  public changePlace = false;
  public loading = false;
  public isNight = false;
  public ngSelectType: any;
  public ngSelectPercentage: any;
  public allowToAccumulate = false;
  public optionPercentage: any = [];

  public typeDiscount = [
    {
      value: 'percentage',
      name: 'Porcentaje',
    },
    {
      value: 'amount',
      name: 'Monto',
    },
    {
      value: 'none',
      name: 'No aplica',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    public modal: ModalsService,
    private rest: RestService
  ) {
    this.form = this.formBuilder.group({
      percentageAmount: ['', [Validators.required]],
      discount: ['', Validators.required],
      amountDiscount: [],
      startAt: [],
      endAt: [],
    });
  }

  ngOnInit(): void {
    this.optionsInPercentage();

    if (this.updateItem) {
      this.formObjectPatch();
    }
  }

  optionsInPercentage(): any {
    const { payAmount } = this.departure;
    const arrayValue = _.map(payAmount, (i) => i.percentageAmount);
    const allValues = _.filter(this.setting, (i) => !arrayValue.includes(i));
    _.map(allValues, (i) => {
      this.optionPercentage.push({
        value: i,
        name: ` ${i} %`,
      });
    });
    if (this.updateItem) {
      const { percentageAmount } = this.discount;
      this.optionPercentage.push({
        value: percentageAmount,
        name: ` ${percentageAmount} %`,
      });
    }
  }

  onSubmit(): any {
    this.loading = true;
    this.updateItem ? this.update() : this.save();
  }

  update(): any {
    const { payAmount } = this.departure;
    const newPayAmount = _.clone(payAmount);
    const positionDiscount = _.findIndex(newPayAmount, {
      _id: this.discount._id,
    });

    const body = this.createObjectPost();
    newPayAmount[positionDiscount] = {
      ...body,
      _id: this.discount._id,
    };
    this.rest
      .patch(`departures/${this.departure._id}`, { payAmount: newPayAmount })
      .subscribe((res: any) => {
        this.departure.payAmount = res.payAmount;
        this.rest.toastSuccess(
          'Se ha actualizado el Porcentaje Exitosamente',
          'Porcentaje actualizado'
        );
        this.modal.close();
        this.loading = false;
      });
  }

  // tslint:disable-next-line:typedef
  async save() {
    const body = this.createObjectPost();
    const payAmount = _.clone(this.departure.payAmount);
    payAmount.push(body);
    this.rest
      .patch(`departures/${this.departure._id}`, { payAmount })
      .subscribe((res: any) => {
        this.departure.payAmount = res.payAmount;
        this.rest.toastSuccess(
          'Se ha creado el porcentaje de pago  exitosamente.',
          'Porcentaje de Pago creada'
        );
        this.modal.close();
        this.loading = false;
      });
  }

  getDate(formControl: any): any {
    return moment(this.form.value[formControl]).toDate();
  }

  createObjectPost = () => {
    try {
      const { value } = this.form;
      let object: any = value;
      const { amountDiscount } = value;

      object = {
        ...object,
        startAt: this.checkDate(value.startAt),
        endAt: this.checkDate(value.endAt),
        amountDiscount: parseFloat(amountDiscount),
        allowToAccumulate: this.allowToAccumulate,
      };
      if (this.ngSelectType === 'none') {
        object = {
          ...object,
          amountDiscount: null,
          startAt: null,
          endAt: null,
        };
      }
      return object;
    } catch (e) {
      return {};
    }
  };

  checkDate(date: any) {
    return moment(date).toString() !== 'Invalid date'
      ? moment(date).toString()
      : undefined;
  }

  stringToDate(str: any): any {
    return str ? moment(str).toDate() : null;
  }

  transformPrice(num: any): any {
    try {
      return _.join(_.split(num.toString(), '.'), ',');
    } catch (e) {
      return null;
    }
  }

  formObjectPatch(): any {
    const {
      percentageAmount,
      discount,
      amountDiscount,
      startAt,
      endAt,
      allowToAccumulate,
    } = this.discount;
    const object = {
      percentageAmount,
      discount,
      amountDiscount,
      startAt: this.stringToDate(startAt),
      endAt: this.stringToDate(endAt),
    };
    this.ngSelectPercentage = percentageAmount;
    this.ngSelectType = discount;
    this.allowToAccumulate = allowToAccumulate;
    this.form.patchValue(object);
  }
}
