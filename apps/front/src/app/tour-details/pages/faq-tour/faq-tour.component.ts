import { Component, Input, OnInit } from '@angular/core';
import { IncludesService } from '../includes/services/includes.service';
import {
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-faq-tour',
  templateUrl: './faq-tour.component.html',
  styleUrls: ['./faq-tour.component.scss'],
})
export class FaqTourComponent implements OnInit {
  @Input() tour: any;
  loading: any;
  select = 1;
  faAngleDown = faAngleDown;
  public includes: any = [];

  constructor(public includesService: IncludesService) {}

  ngOnInit(): void {}

  changeTab(tab: number): any {
    this.select = tab;
  }


}
