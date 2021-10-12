import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight-balance',
  templateUrl: './flight-balance.component.html',
  styleUrls: ['./flight-balance.component.scss']
})
export class FlightBalanceComponent implements OnInit {
  @Input() mainFlight: any;
  @Input() params: any;

  constructor() { }

  ngOnInit(): void {
  }

}
