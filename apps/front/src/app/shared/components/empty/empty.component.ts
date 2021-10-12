import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss']
})
export class EmptyComponent implements OnInit {
  @Input() alertCovid = false;
  @Input() loading = false;
  @Input() data: any;
  @Input() text = 'SEARCH.TOURS.SORRY_NOT_FOUND';
  constructor() { }

  ngOnInit(): void {
  }

}
