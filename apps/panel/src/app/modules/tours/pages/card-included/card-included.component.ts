import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { ModalsService } from 'src/app/modules/shared/modals.service';
import { FormIncludeComponent } from '../form-include/form-include.component';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons';
import * as _ from 'lodash';
import { IncludedService } from '../../services/included.service';

@Component({
  selector: 'app-card-included',
  templateUrl: './card-included.component.html',
  styleUrls: ['./card-included.component.scss'],
})
export class CardIncludedComponent implements OnInit {
  @Input() item: any;
  @Input() tour: any;
  @Input() type: string;
  @Output() eventButton = new EventEmitter<any>();

  faTrashAlt = faTrashAlt;
  faEdit = faEdit;

  constructor(
    public translate: TranslateService,
    public share: SharedService,
    private rest: RestService,
    public includesService: IncludedService,
    public modalService: ModalsService
  ) {}

  ngOnInit(): void {}

  updateItem(item): any {
    const data = { tour: this.tour, updateItem: true, item, type: this.type };
    this.modalService.openComponent(
      data,
      FormIncludeComponent,
      'modal-light-plan'
    );
  }

  deleteItem(idItem): any {
    this.share
      .confirm()
      .then((res: any) => {
        _.remove(this.tour[this.type], { _id: idItem });
        const data = { ...this.tour };
        this.includesService
          .updateIncluded(`${this.tour._id}`, data)
          .subscribe(() => {
            this.includesService.callback.emit({
              _id: idItem,
              event: 'delete',
            });
            this.rest.toastSuccess(
              `Se ha eliminado el/la ${this.type} exitosamente.`,
              `${this.type} Eliminada`
            );
          });
      })
      .catch((err) => console.log(err));
  }

  isOpen($event: boolean, index: any): any {
    // this.changeOpen.emit({item: $event, index});
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

  onDragged(item: any, list: any[], effect: DropEffect, group: any): any {
    // this.currentDragEffectMsg = `Drag ended with effect "${effect}"!`;
    if (effect === 'move') {
      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }

  onDragEnd(event: DragEvent, group: any): any {
    // this.currentDraggableEvent = event;
    console.log(group?.title);
    console.log('actualizar', group?.tickets);
    // this.updateGroup(group?.tickets, group);
  }

  updateItinerary(itinerary: any) {}

  deleteItinerary(_id: any) {}

  updateValuesFromApi(res) {
    const { included, notIncluded, faq } = res;
    this.tour.included = included;
    this.tour.notIncluded = notIncluded;
    this.tour.faq = faq;
  }
}
