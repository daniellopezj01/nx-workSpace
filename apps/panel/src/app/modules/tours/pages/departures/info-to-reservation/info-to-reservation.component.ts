import { RestService } from './../../../../../services/rest/rest.service';
/* eslint-disable @angular-eslint/component-selector */
import { SharedService } from './../../../../shared/shared.service';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ModalsService } from '../../../../shared/modals.service';

@Component({
  selector: 'app-info-to-reservation',
  templateUrl: './info-to-reservation.component.html',
  styleUrls: ['./info-to-reservation.component.scss']
})
export class InfoToReservationComponent implements AfterViewInit {
  public form: FormGroup;
  @Input() departure: any;
  textRichId = 'toReservation'
  public loading = false;

  constructor(
    public modal: ModalsService,
    private formBuilder: FormBuilder,
    private shared: SharedService,
    private rest: RestService
  ) {
    this.form = this.formBuilder.group({
      text: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.setData()
  }

  setData() {
    const { infoToReservation } = this.departure
    if (infoToReservation) {
      const { attached } = infoToReservation
      this.shared.setFilesTextRich.emit({ id: this.textRichId, attached })
      this.form.patchValue(infoToReservation)
    }
  }

  updateInfo() {
    this.loading = true
    this.shared.callbackValueTextRich.emit({ id: this.textRichId })
  }

  captureData($event: any) {
    const data = { attached: $event, ...this.form.value }
    this.rest
      .patch(`departures/${this.departure._id}`, { infoToReservation: data })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: any) => {
        this.rest.toastSuccess(
          'Se ha Actualizado la salida exitosamente.',
          'Salida Actualizada'
        );
        this.modal.close();
      });
  }

}
