import { RestService } from './../../../../../services/rest/rest.service';
import { finalize } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import _ from 'lodash';
import moment from 'moment';
import { SharedService } from '../../../../shared/shared.service';
import { ModalsService } from '../../../../shared/modals.service';

@Component({
  selector: 'app-form-departure',
  templateUrl: './form-departure.component.html',
  styleUrls: ['./form-departure.component.scss']
})
export class FormDepartureComponent implements OnInit {
  public form: FormGroup;
  @Input() tour: any;
  @Input() departure: any;
  @Input() updateItem = false;
  public data: any = {};
  public today = moment().toDate();
  public tags: any = [];
  public flight = false;
  public currencies = false;
  public loading = false;
  public settings: any;
  public errorStock = false;
  public errorAge = false;
  public ngSelectStatus: any;
  public status: any = [
    {
      name: 'Visible',
      value: 'visible',
    },
    {
      name: 'No visible',
      value: 'not_visible',
    },
    {
      name: 'Cerrado',
      value: 'close',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    public shared: SharedService,
    public modal: ModalsService,
    private rest: RestService
  ) {
    this.form = this.formBuilder.group({
      startDateDeparture: ['', Validators.required],
      endDateDeparture: ['', Validators.required],
      closeDateDeparture: ['', Validators.required],
      normalPrice: ['', Validators.required],
      minStock: ['', Validators.required],
      stock: ['', Validators.required],
      minAge: ['', Validators.required],
      maxAge: ['', Validators.required],
      status: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    if (this.updateItem) {
      this.formObjectPatch();
    }
    this.settings = this.shared.getSettings();
  }

  getDate(formControl: any): any {
    return moment(this.form.value[formControl]).toDate();
  }

  onSubmit(): any {
    this.loading = true;
    this.updateItem ? this.update() : this.save();
  }

  update(): any {
    const body = this.createObjectPost();
    this.rest
      .patch(`departures/${this.departure._id}`, body)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.rest.toastSuccess(
          'Se ha Actualizado la salida exitosamente.',
          'Salida Actualizada'
        );
        this.shared.updateDeparture.emit(res);
        this.modal.close();
      });
  }

  save() {
    const body = this.createObjectPost();
    this.rest
      .post('departures', body)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.rest.toastSuccess(
          'Se ha creado la salida exitosamente.',
          'Salida creada'
        );
        this.shared.saveDeparture.emit(res);
        this.modal.close();
      });
  }

  formObjectPatch(): any {
    const {
      startDateDeparture,
      endDateDeparture,
      closeDateDeparture,
      normalPrice,
      flight,
      status,
    } = this.departure;
    this.flight = flight;
    this.ngSelectStatus = status;
    this.form.patchValue({
      ...{
        startDateDeparture: this.stringToDate(startDateDeparture),
        endDateDeparture: this.stringToDate(endDateDeparture),
        closeDateDeparture: this.stringToDate(closeDateDeparture),
        normalPrice: this.transformPrice(normalPrice),
        // payAmount: _.map(payAmount, (a) => a.toString()),
      },
      ...this.departure,
    });
  }

  transformPrice(num: number): any {
    try {
      return _.join(_.split(num.toString(), '.'), ',');
    } catch (e) {
      return null;
    }
  }

  stringToDate(str: string): any {
    return moment(str, 'DD-MM-YYYY').toDate();
  }

  transformDate(date: any): any {
    return moment(date).format('DD-MM-YYYY');
  }

  checkStock(): any {
    const { minStock, stock } = this.form.value;
    if (minStock && stock) {
      // tslint:disable-next-line:radix
      this.errorStock = parseInt(stock) - parseInt(minStock) < 0;
    }
  }

  checkAge(): any {
    const { minAge, maxAge } = this.form.value;
    if (minAge && maxAge) {
      // tslint:disable-next-line:radix
      this.errorAge = parseInt(maxAge) - parseInt(minAge) < 0;
    }
  }

  createObjectPost() {
    try {
      const { value } = this.form;
      let object: any = value;
      const {
        startDateDeparture,
        endDateDeparture,
        closeDateDeparture,
        normalPrice,
        minStock,
        stock,
        minAge,
        maxAge,
      } = value;
      object = {
        startDateDeparture: this.transformDate(startDateDeparture),
        endDateDeparture: this.transformDate(endDateDeparture),
        closeDateDeparture: this.transformDate(closeDateDeparture),
        normalPrice: parseFloat(normalPrice) || 0,
        minStock: parseInt(minStock),
        stock: parseInt(stock),
        minAge: parseInt(minAge),
        maxAge: parseInt(maxAge),
        idTour: this.tour?._id,
        flight: this.flight,
        status: this.ngSelectStatus,
      };
      if (this.currencies) {
        object.currencies = this.currencies
      }
      return { ...value, ...object };
    } catch (e) {
      console.log(e)
      return {};
    }
  };

  check($event: any) {
    console.log($event);
  }
}
