/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ItineraryService } from '../../services/itinerary.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss'],
})
export class ItineraryComponent implements OnInit, OnDestroy {
  @Input() data: any;
  // data: any;
  private currentDragEffectMsg = '';
  public listSubscribers: any = [];

  constructor(private itineraryService: ItineraryService) { }

  ngOnInit(): void {
    // this.data = this.dataIn
    this.listObserver();
  }

  listObserver = () => {
    const observer1$ = this.itineraryService.callback.subscribe((res: any) => {
      if (res?.event === 'delete') {
        _.remove(this.data, { _id: res?._id });
      }
    });

    this.listSubscribers.push(observer1$);
  };

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
    const index = _.map(group, '_id');
    item = { ...item, ...{ sorts: index } };
    this.itineraryService.updateItinerary(item?._id, item).subscribe(
      (res: any) => { },
      (err) => { }
    );
    // this.updateGroup(group?.tickets, group);
  }

  onDragged(item: any, list: any[], effect: DropEffect, group: any): any {
    this.currentDragEffectMsg = `Drag ended with effect "${effect}"!`;
    if (effect === 'move') {
      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }

  isChange($event: any): any {
    const index = $event?.index;
    this.data[index] = Object.assign(this.data[index], {
      disabled: $event?.item,
    });
  }

  ngOnDestroy(): any {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }
}
