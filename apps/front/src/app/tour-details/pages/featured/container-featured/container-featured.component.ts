import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-container-featured',
  templateUrl: './container-featured.component.html',
  styleUrls: ['./container-featured.component.scss'],
})
export class ContainerFeaturedComponent implements OnInit {
  @Input() tour: any;
  included: any = [];

  constructor() {}

  ngOnInit(): void {
    const { included } = this.tour;
    this.included = _.filter(included, (i) => i.isFeatured);
  }
}
