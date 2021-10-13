import { Component, Input, OnInit } from '@angular/core';
import { DepartureService } from '../../services/departure.service';

@Component({
  selector: 'app-call-login',
  templateUrl: './call-login.component.html',
  styleUrls: ['./call-login.component.scss'],
})
export class CallLoginComponent {
  @Input() isLogged = false;
  @Input() activeDepartures: any = {};

  constructor(private service: DepartureService) { }


  login(event: any) {
    this.service.activeSession.emit(true);
  }

  register(event: any) {
    this.service.activeSession.emit(true);
  }
}
