import { Component, Input, OnInit } from '@angular/core';
import { IncludedService } from '../../services/included.service';
import { FormsGenericService } from '../../services/forms-generic.service';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  @Input() data: any;
  public listSubscribers: any = [];

  constructor(
    private includesService: IncludedService,
    private formsGenericService: FormsGenericService
  ) {}

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
      .subscribe((res) => {});
  }

  onDragged(item: any, list: any[], effect: DropEffect, group: any): any {
    if (effect === 'move') {
      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }

  listObserver = () => {};

  ngOnDestroy(): any {
    this.listSubscribers.forEach((a) => a.unsubscribe());
  }
}
