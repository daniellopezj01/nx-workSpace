/* eslint-disable @angular-eslint/component-selector */
import { RestService } from './../../../../services/rest/rest.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import _ from 'lodash';
import { ItineraryService } from '../../services/itinerary.service';
import { finalize } from 'rxjs/operators';
import { SharedService } from '../../../shared/shared.service';
import { ModalsService } from '../../../shared/modals.service';

@Component({
  selector: 'app-modal-itinerary',
  templateUrl: './modal-itinerary.component.html',
  styleUrls: ['./modal-itinerary.component.scss'],
})
export class ModalItineraryComponent implements OnInit {
  @Input() tour: any;
  @Input() itinerary: any;
  @Input() updateItem = false;
  public form: FormGroup;
  public data: any = {};
  public changePlace = false;
  public loading = false;
  public includedInMap = false;

  constructor(
    private formBuilder: FormBuilder,
    private shared: SharedService,
    private itineraryService: ItineraryService,
    public modal: ModalsService,
    private rest: RestService
  ) {
    this.form = this.formBuilder.group({
      itineraryName: ['', Validators.required],
      place: ['', [Validators.required, Validators.min(0)]],
      titleActivity: ['', !this.updateItem ? Validators.required : null],
      descriptionActivity: [
        '',
        !this.updateItem ? [Validators.required, Validators.min(0)] : null,
      ],
    });
  }

  ngOnInit(): void {

    if (this.updateItem) {
      this.formObjectPatch();
    }
  }

  public handleAddressChange(address: Address): any {
    const places: any = {};
    places.country = _.last(address.address_components)?.long_name;
    places.countryCode = _.last(address.address_components)?.short_name;
    places.city = _.first(address.address_components)?.long_name;
    places.coordinates = [
      address.geometry.location.lat(),
      address.geometry.location.lng(),
    ];
    if (this.updateItem) {
      this.data = places;
    } else {
      this.data.stringLocation = places;
    }
    this.changePlace = true;
  }

  onSubmit(): any {
    this.loading = true;
    this.updateItem ? this.update() : this.save();
  }

  update(): any {
    const {
      itineraryName,
      titleActivity,
      descriptionActivity,
    } = this.form.value;
    this.itinerary.itineraryName = itineraryName;
    this.itinerary.includedInMap = this.includedInMap
    if (this.changePlace) {
      this.itinerary.stringLocation = this.data;
    }
    this.itinerary.details[0].title = titleActivity;
    this.itinerary.details[0].description = descriptionActivity;

    this.itineraryService
      .updateItinerary(this.itinerary?._id, this.itinerary)
      .subscribe((res) => {
        this.rest.toastSuccess(
          'Se ha Actualizado el itinerario exitosamente.',
          'Itinerario Actualizado'
        );
        this.modal.close();
        this.loading = false;
      });
  }

  async save(): Promise<any> {
    let object: any;
    await this.createObjectPost().then((a) => {
      object = a;
    });
    this.data = { ...this.data, ...object };
    this.itineraryService
      .saveItinerary(this.data)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.rest.toastSuccess(
          'Se ha creado el itinerario exitosamente.',
          'Itinerario creado'
        );
        this.shared.saveItinerary.emit(res);
        this.modal.close();
      });
  }

  formObjectPatch(): any {
    const { itineraryName, stringLocation, details, includedInMap } = this.itinerary;
    const activity: any = _.first(details);
    this.includedInMap = includedInMap
    this.form.patchValue({
      itineraryName,
      place: `${stringLocation.city}, ${stringLocation.country}`,
      titleActivity: activity.title,
      descriptionActivity: activity.description,
    });
  }

  createObjectPost = () =>
    new Promise((resolve) => {
      const object: any = {};
      const {
        titleActivity,
        descriptionActivity,
        itineraryName,
      } = this.form.value;

      object.details = [
        { title: titleActivity, description: descriptionActivity },
      ];
      object.idTour = this.tour._id;
      object.itineraryName = itineraryName;
      object.includedInMap = this.includedInMap
      resolve(object);
    });
}
