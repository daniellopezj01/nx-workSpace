import { ReservationService } from '../../../reservation.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chats-support',
  templateUrl: './chats-support.component.html',
  styleUrls: ['./chats-support.component.scss'],
})
export class ChatsSupportComponent implements OnInit {
  chats: any = [];
  loading = true;
  reservation: any;
  idReservation: any;
  constructor(
    private service: ReservationService,
    private active: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.service.setCode(this.active.snapshot.parent?.params.id);
    this.reservation = await this.service.getData();
    this.chats = await this.service.getChats();
    const { _id } = this.reservation;
    this.idReservation = _id;
    this.loading = false;
  }

  selectChat(item: any) {
    const { hash } = item;
    this.service.selectChat.emit(hash);
  }
}
