import { Component, Input, OnInit } from '@angular/core';
import {DepartureService} from '../../services/departure.service';

@Component({
  selector: 'app-call-login',
  templateUrl: './call-login.component.html',
  styleUrls: ['./call-login.component.scss'],
})
export class CallLoginComponent implements OnInit {
  @Input() isLogged = false;
  @Input() activeDepartures: any = {};

  constructor(private service: DepartureService) {}

  ngOnInit(): void {}

  login(event) {
    this.service.activeSession.emit(true);
  }

  register(event) {
    this.service.activeSession.emit(true);
  }
}
