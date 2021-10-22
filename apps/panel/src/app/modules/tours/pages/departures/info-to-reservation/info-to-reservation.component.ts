import { SharedService } from './../../../../shared/shared.service';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalsService } from 'src/app/modules/shared/modals.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-info-to-reservation',
  templateUrl: './info-to-reservation.component.html',
  styleUrls: ['./info-to-reservation.component.scss']
})
export class InfoToReservationComponent implements OnInit, AfterViewInit {
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
  }

  ngOnInit(): void {
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

  captureData($event) {
    const data = { attached: $event, ...this.form.value }
    this.rest
      .patch(`departures/${this.departure._id}`, { infoToReservation: data })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.rest.toastSuccess(
          'Se ha Actualizado la salida exitosamente.',
          'Salida Actualizada'
        );
        this.modal.close();
      });
  }

}
