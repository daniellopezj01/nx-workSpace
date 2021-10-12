import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss'],
})
export class TopComponent implements OnInit {
  active = 0;
  mainActions = [
    {
      id: 0,
      name: 'SEARCH.FILTERS.TOURS',
      route: 'tours',
      icon: 'uil uil-bag',
    },
    // {
    //   id: 1,
    //   name: 'SEARCH.FILTERS.HOTELS',
    //   route: 'hotels',
    //   icon: 'uil uil-bed-double',
    // },
    {
      id: 2,
      name: 'SEARCH.FILTERS.FLIGHTS',
      route: 'flights',
      icon: 'uil uil-plane-fly',
    },
  ];

  constructor(public translate: TranslateService) { }

  changeItem(value: number) {
    this.active = value;
  }

  ngOnInit(): void { }
}
