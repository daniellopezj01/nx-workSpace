import { Router } from '@angular/router';
import { ReservationService } from '../../reservation.service';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalsService } from '../../../core/services/modals.service';
import { RestService } from '../../../core/services/rest.service';


@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss'],
})
export class NewMessageComponent {
  @Input() idReservation: any;
  @Input() code: any;
  public loading = false;
  public form: FormGroup;

  constructor(
    private modalService: ModalsService,
    private formBuilder: FormBuilder,
    private rest: RestService,
    private service: ReservationService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  closeModal() {
    this.modalService.close();
  }

  send() {
    this.loading = true;
    const { message } = this.form.value;
    const object = { codeReservation: this.code, message };
    this.rest.post('support', object).subscribe(
      (res) => {
        this.service.setCurrentChat(res);
        const { hash } = res;
        this.router.navigate(['/', 'trips', this.code, 'support', hash]);
        this.loading = false;
        this.closeModal();
      },
      (err) => {
        console.log(err);
        this.closeModal();
      }
    );
  }
}
