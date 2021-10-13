import { ModalsService } from './../../../../core/services/modals.service';
import { NewMessageComponent } from '../../../modals/new-message/new-message.component';
import { ReservationService } from '../../../reservation.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-container-support',
  templateUrl: './container-support.component.html',
  styleUrls: ['./container-support.component.scss'],
})
export class ContainerSupportComponent implements OnInit {
  public reservation: any;
  public hash = '';
  public loading = true;
  private code = '';

  constructor(
    private service: ReservationService,
    private active: ActivatedRoute,
    private router: Router,
    private serviceModal: ModalsService
  ) { }

  async ngOnInit() {
    this.code = this.active.snapshot.parent?.params.id;
    this.service.setCode(this.code);
    this.hash = this.active.snapshot.params.hash;
    this.reservation = await this.service.getData();
    this.loading = false;
    this.service.selectChat.subscribe((res) => {
      this.hash = res;
      this.router.navigate(['/', 'trips', this.code, 'support', res]);
    });
  }

  newChat() {
    const data = { idReservation: this.reservation._id, code: this.code };
    this.serviceModal.openComponent(
      data,
      NewMessageComponent,
      'modal-lg w-100',
      true
    );
  }
}
