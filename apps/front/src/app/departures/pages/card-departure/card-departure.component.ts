import { Component, Input, OnInit } from '@angular/core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { DepartureService } from '../../services/departure.service';

@Component({
  selector: 'app-card-departure',
  templateUrl: './card-departure.component.html',
  styleUrls: ['./card-departure.component.scss'],
})
export class CardDepartureComponent implements OnInit {
  @Input() item: any;
  @Input() activeDepartures: any;
  public opacity = '0.5';
  public hover: any;
  public faArrowRight = faArrowRight;
  public fromPercentage = false;
  constructor(private service: DepartureService) { }

  ngOnInit(): void {
    this.item.payAmount = _.orderBy(
      this.item.payAmount,
      ['percentageAmount'],
      ['desc']
    );
  }

  calcDiscount = (max: any, min: any) => Math.trunc(max - min);

  changeInputValue(item: any) {
    if (['OK', 'visible', true].includes(item?.status)) {
      setTimeout(() => {
        if (!this.fromPercentage) {
          this.service.selectIndexPercentage = 0;
        }
        this.service.selectItem.emit(item);
        this.fromPercentage = false;
      }, 10);
    }
  }

  selectPercentage(index: any) {
    this.fromPercentage = true;
    this.service.selectIndexPercentage = index;
  }
}
