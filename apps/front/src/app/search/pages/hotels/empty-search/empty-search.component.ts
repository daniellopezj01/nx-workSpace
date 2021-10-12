import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-search',
  templateUrl: './empty-search.component.html',
  styleUrls: ['./empty-search.component.scss'],
})
export class EmptySearchComponent implements OnInit {
  qParam = '';
  constructor() {}

  ngOnInit(): void {}
}
