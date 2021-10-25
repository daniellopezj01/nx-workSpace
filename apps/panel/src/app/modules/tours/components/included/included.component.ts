/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ItineraryService } from '../../services/itinerary.service';
import { IncludedService } from '../../services/included.service';
import { FormsGenericService } from '../../services/forms-generic.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-included',
  templateUrl: './included.component.html',
  styleUrls: ['./included.component.scss'],
})
export class IncludedComponent implements OnInit, OnDestroy {
  @Input() data: any;
  public listSubscribers: any = [];

  constructor(
    private includesService: IncludedService,
    private formsGenericService: FormsGenericService
  ) { }

  ngOnInit(): void {
    this.listObserver();
  }

  onDrop(event: DndDropEvent, list?: any[]): any {
    if (list && ['copy', 'move'].includes(event.dropEffect)) {
      let index = event.index;
      if (typeof index === 'undefined') {
        index = list.length;
      }
      list.splice(index, 0, event.data);
    }
  }

  onDragEnd(event: DragEvent, group: any, item: any): any {
    const body = { ...this.data, ...{ included: group } };
    this.includesService
      .updateIncluded(this.data?._id, body)
      .subscribe((res: any) => { });
  }

  onDragged(item: any, list: any[], effect: DropEffect, group: any): any {
    if (effect === 'move') {
      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }

  listObserver = () => {
    const observer1$ = this.formsGenericService.callback.subscribe((res: any) => {
      if (res?.type === 'included') {
        this.data.included = res?.item?.included;
      }
    });
    this.listSubscribers.push(observer1$);
  };

  ngOnDestroy(): any {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }
}
