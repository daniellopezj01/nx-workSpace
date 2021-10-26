import { RestService } from './../../../../../services/rest/rest.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  faTrashAlt,
  faEdit,
  faPlusSquare,
  faEyeSlash,
  faEye,

} from '@fortawesome/free-regular-svg-icons';
import { faAngleDown, faLock } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import moment from 'moment';
import { DatePipe } from '@angular/common';
import { ModalPayAmountComponent } from '../../modal-pay-amount/modal-pay-amount.component';
import { DetailsDepartureComponent } from '../details-departure/details-departure.component';
import { SharedService } from '../../../../shared/shared.service';
import { ModalsService } from '../../../../shared/modals.service';

@Component({
  selector: 'app-card-departures',
  templateUrl: './card-departures.component.html',
  styleUrls: ['./card-departures.component.scss'],
})
export class CardDeparturesComponent implements OnInit {
  @Input() departure: any = {};
  @Input() tour: any = {};
  @Input() index = 0;
  @Output() eventButton = new EventEmitter<any>();
  @Output() changeOpen = new EventEmitter<any>();
  faPlusSquare = faPlusSquare;
  faAngleDown = faAngleDown;
  faLock = faLock;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  faEyeSlash = faEyeSlash;
  faEye = faEye;

  columns = [
    { key: 'TOUR.DEPARTURE.TABLE.DISCOUNT' },
    { key: 'TOUR.DEPARTURE.TABLE.DISCOUNT_TYPE' },
    { key: 'TOUR.DEPARTURE.TABLE.DISCOUNT_AMOUNT' },
    { key: 'TOUR.DEPARTURE.TABLE.START_DATE' },
    { key: 'TOUR.DEPARTURE.TABLE.END_DATE' },
    { key: 'TOUR.DEPARTURE.TABLE.STACKABLE' },
    { key: 'TOUR.DEPARTURE.TABLE.UPDATE' },
    { key: 'TOUR.DEPARTURE.TABLE.DELETE' },
  ];

  constructor(
    public translate: TranslateService,
    public share: SharedService,
    private rest: RestService,
    private modalService: ModalsService,
    public datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    const {
      startDateDeparture,
      endDateDeparture,
      closeDateDeparture,
    } = this.departure;
    this.departure = {
      ...this.departure,
      startDateDeparture: this.stringToDate(startDateDeparture),
      endDateDeparture: this.stringToDate(endDateDeparture),
      closeDateDeparture: closeDateDeparture ? this.stringToDate(closeDateDeparture) : null,
    };
  }

  updateDeparture(departure: any) {
    const data = { tour: this.tour, updateItem: true, departure };
    this.modalService.openComponent(
      data,
      DetailsDepartureComponent,
      'modal-light-plan'
    );
  }

  deleteDeparture(id: string) {
    this.share
      .confirm()
      .then(() => {
        this.rest.delete(`departures/${id}`).subscribe(() => {
          _.remove(this.tour.departures, { _id: id });
        });
        this.rest.toastSuccess(
          'Se ha eliminado la salida exitosamente.',
          'Salida Eliminada'
        );
      })
      .catch((err) => console.log(err));
  }

  stringToDate(string: string) {
    return moment(string, 'DD-MM-YYYY').toDate();
  }

  isOpen($event: boolean, index: any): any {
    this.changeOpen.emit({ item: $event, index });
  }

  openModalSave(): any {
    const { setting } = this.tour;
    const data = { departure: this.departure, setting };
    this.modalService.openComponent(
      data,
      ModalPayAmountComponent,
      'modal-light-plan'
    );
  }

  updateAmount(item: any) {
    const { setting } = this.tour;
    const data = {
      departure: this.departure,
      updateItem: true,
      discount: item,
      setting,
    };
    this.modalService.openComponent(
      data,
      ModalPayAmountComponent,
      'modal-light-plan'
    );
  }

  deleteAmount(id: string) {
    const payAmount = _.clone(this.departure.payAmount);
    _.remove(payAmount, { _id: id });
    this.share
      .confirm()
      .then(() => {
        this.rest
          .patch(`departures/${this.departure?._id}`, { payAmount })
          .subscribe(() => {
            this.departure.payAmount = payAmount;
            this.rest.toastSuccess(
              'Se ha eliminado el porcentaje de pago exitosamente.',
              'Porcentaje de Pago Eliminado'
            );
          });
      })
      .catch((err) => console.log(err));
  }
}
