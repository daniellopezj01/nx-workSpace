import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalsService } from 'src/app/modules/shared/modals.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { ModalItineraryComponent } from '../modal-itinerary/modal-itinerary.component';
import {
  faTrashAlt,
  faEdit,
  faPlusSquare,
} from '@fortawesome/free-regular-svg-icons';
import { faAngleDown, faLock } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { ModalActivityComponent } from '../modal-activity/modal-activity.component';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { ItineraryService } from '../../services/itinerary.service';

@Component({
  selector: 'app-card-itinerary',
  templateUrl: './card-itinerary.component.html',
  styleUrls: ['./card-itinerary.component.scss'],
})
export class CardItineraryComponent implements OnInit {
  @Input() itinerary: any = {};
  @Input() tour: any = {};
  @Input() index = 0;
  @Input() fullView = 0;
  @Output() eventButton = new EventEmitter<any>();
  @Output() changeOpen = new EventEmitter<any>();
  faPlusSquare = faPlusSquare;
  faAngleDown = faAngleDown;
  faLock = faLock;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;

  constructor(
    public translate: TranslateService,
    public share: SharedService,
    private modalService: ModalsService,
    private rest: RestService,
    private itineraryService: ItineraryService
  ) {}

  ngOnInit(): void {}

  openModalSave(): any {
    this.eventButton.emit(true);
    const data = { itinerary: this.itinerary };
    this.modalService.openComponent(
      data,
      ModalActivityComponent,
      'modal-light-plan'
    );
  }

  updateItinerary(itinerary): any {
    this.eventButton.emit(true);
    const data = { tour: this.tour, updateItem: true, itinerary };
    this.modalService.openComponent(
      data,
      ModalItineraryComponent,
      'modal-light-plan'
    );
  }

  deleteItinerary(id): any {
    this.eventButton.emit(true);
    this.share
      .confirm()
      .then(() => {
        this.itineraryService.deleteItinerary(id).subscribe(() => {
          console.log({ _id: id, event: 'delete' });
          this.itineraryService.callback.emit({ _id: id, event: 'delete' });
        });
        this.rest.toastSuccess(
          'Se ha eliminado el itinerario exitosamente.',
          'Itinerario Eliminado'
        );
      })
      .catch((err) => console.log(err));
  }

  deleteActivity(idActivity): any {
    this.eventButton.emit(true);
    const details = _.clone(this.itinerary.details);
    _.remove(details, { _id: idActivity });
    this.share
      .confirm()
      .then((res) => {
        this.itineraryService
          .updateItinerary(this.itinerary?._id, { details })
          .subscribe(() => {
            this.itinerary.details = details;
            this.rest.toastSuccess(
              'Se ha eliminado la actividad exitosamente.',
              'Actividad Eliminada'
            );
          });
      })
      .catch((err) => console.log(err));
  }

  updateActivity(activity): any {
    this.eventButton.emit(true);
    const data = { itinerary: this.itinerary, updateItem: true, activity };
    this.modalService.openComponent(
      data,
      ModalActivityComponent,
      'modal-light-plan'
    );
  }

  isOpen($event: boolean, index: any): any {
    this.changeOpen.emit({ item: $event, index });
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
}
