import {Component, Input, OnInit} from '@angular/core';
import {IncludesService} from './services/includes.service';
import {faAngleDown} from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';

@Component({
  selector: 'app-includes',
  templateUrl: './includes.component.html',
  styleUrls: ['./includes.component.scss'],
})
export class IncludesComponent implements OnInit {
  @Input() tour: any;
  loading = false;
  select = 1;
  included: any = [];
  faAngleDown = faAngleDown;
  public includes: any = [];

  constructor(public includesService: IncludesService) {
  }

  ngOnInit(): void {
    const {included} = this.tour;
    // this.included = _.filter(included, (i) => !i.isFeatured);
    this.included = included;
  }

  changeTab(tab: number): any {
    this.select = tab;
  }
}
