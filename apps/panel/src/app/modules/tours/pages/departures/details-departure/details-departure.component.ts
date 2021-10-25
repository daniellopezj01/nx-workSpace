/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-details-departure',
  templateUrl: './details-departure.component.html',
  styleUrls: ['./details-departure.component.scss']
})
export class DetailsDepartureComponent implements OnInit {
  @Input() tour: any;
  @Input() departure: any;
  @Input() updateItem = false;
  public loading = false;


  constructor() { }

  ngOnInit(): void {
  }

}
