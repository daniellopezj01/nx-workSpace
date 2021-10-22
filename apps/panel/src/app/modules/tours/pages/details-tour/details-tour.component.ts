/* eslint-disable @angular-eslint/component-selector */
import { RestService } from './../../../../services/rest/rest.service';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { ModalItineraryComponent } from '../modal-itinerary/modal-itinerary.component';
import { FormIncludeComponent } from '../form-include/form-include.component';
import { FormsGenericService } from '../../services/forms-generic.service';
import { FormDepartureComponent } from '../departures/form-departure/form-departure.component';
import { SharedService } from '../../../shared/shared.service';
import { MediaService } from '../../../shared/drop-galery/media.service';
import { ModalsService } from '../../../shared/modals.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details-tour',
  templateUrl: './details-tour.component.html',
  styleUrls: ['./details-tour.component.scss'],
})
export class DetailsTourComponent
  implements OnInit, AfterContentChecked, OnDestroy {
  @ViewChild('placesRef') placesRef?: GooglePlaceDirective;
  // @ViewChild('player') player: YT.Player;
  @Input() id: any;
  public apiLoaded = false;
  // public form: FormGroup;
  public listSubscribers: any = [];
  public tour: any;
  public history: any = [
    {
      name: 'Tours',
      router: ['/'],
    },
    {
      name: 'Nuevo',
      router: null,
    },
  ];
  public preview = {
    image: null,
    blob: null,
  };
  public bsModalRef?: BsModalRef;
  public loading = true;
  public eventFromButton = false;
  public fullView = -1;

  constructor(
    public share: SharedService,
    private rest: RestService,
    private router: Router,
    private modalService: ModalsService,
    private formsGenericService: FormsGenericService,
    private cdref: ChangeDetectorRef,
    public media: MediaService
  ) { }

  ngOnInit(): void {
    this.rest.setActiveConfirmLeave = true;
    this.listObserver();
    this.loadGeneral();
  }

  listObserver = () => {
    const observer1$ = this.share.saveItinerary.subscribe((res) => {
      this.tour.itinerary.push(res);
    });
    const observer2$ = this.share.saveDeparture.subscribe((res) => {
      this.tour.departures.push(res);
    });
    const observer3$ = this.share.updateDeparture.subscribe((res) => {
      const { departures } = this.tour;
      const newResult = departures.map((item: any) =>
        item._id === res._id ? res : item
      );
      this.tour.departures = newResult;
      // const index = _.findIndex(departures, { _id: res.id });
      // departures.splice(index, 1, res);
      // this.tour.depatures = departures;
    });
    const observer4$ = this.formsGenericService.callback.subscribe((res) => {
      this.tour = { ...this.tour, ...res?.item };
    });
    this.listSubscribers = [observer1$, observer2$, observer3$, observer4$];
  };

  ngAfterContentChecked(): any {
    this.cdref.detectChanges();
  }

  ngOnDestroy(): any {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }

  loadGeneral = () => {
    this.rest.get(`tours/${this.id}`).subscribe((res) => {
      this.tour = res;
      this.loading = false;
    });
  };

  openModalSave(action: string): any {
    let data;
    let component: any;
    switch (action) {
      case 'itinerary':
        data = { tour: this.tour };
        component = ModalItineraryComponent;
        break;
      case 'departure':
        data = { tour: this.tour };
        component = FormDepartureComponent;
        break;
      case 'included':
        data = { tour: this.tour, type: 'included' };
        component = FormIncludeComponent;
        break;
      case 'notIncluded':
        data = { tour: this.tour, type: 'notIncluded' };
        component = FormIncludeComponent;
        break;
      case 'faq':
        data = { tour: this.tour, type: 'faq' };
        component = FormIncludeComponent;
        break;
      default:
        break;
    }
    this.modalService.openComponent(data, component, 'modal-light-plan');
  }

  deleteTour(): any {
    this.rest.delete(`tours/${this.tour._id}`).subscribe((res) => {
      this.rest.toastSuccess(
        'Se ha Eliminado el tour exitosamente.',
        'Tour Eliminado'
      );
      this.share.loadingButtons = true;
      this.router.navigate(['/', 'tours']);
    });
  }

  getPropertyObjectTour(string: string) {
    return this.tour?.[string];
  }

}
