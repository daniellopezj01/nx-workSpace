import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ToursRoutingModule } from './tours-routing.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ListToursComponent } from './pages/list-tours/list-tours.component';
import { AddTourComponent } from './pages/add-tour/add-tour.component';
import { FormTourComponent } from './pages/form-tour/form-tour.component';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'ngx-avatar';
import { TimeagoModule } from 'ngx-timeago';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { DetailsTourComponent } from './pages/details-tour/details-tour.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CardItineraryComponent } from './pages/card-itinerary/card-itinerary.component';
import { CardDeparturesComponent } from './pages/departures/card-departures/card-departures.component';
import { ErrorTailorModule } from '@ngneat/error-tailor';
import { CardIncludedComponent } from './pages/card-included/card-included.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { DndModule } from 'ngx-drag-drop';
import { ItineraryComponent } from './components/itinerary/itinerary.component';
import { IncludedComponent } from './components/included/included.component';
import { NotIncludedComponent } from './components/not-included/not-included.component';
import { FaqComponent } from './components/faq/faq.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ManagerGalleryComponent } from './pages/manager-gallery/manager-gallery.component';
import { InfoToReservationComponent } from './pages/departures/info-to-reservation/info-to-reservation.component';
import { DetailsDepartureComponent } from './pages/departures/details-departure/details-departure.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ListToursComponent,
    AddTourComponent,
    FormTourComponent,
    DetailsTourComponent,
    CardItineraryComponent,
    CardDeparturesComponent,
    DetailsDepartureComponent,
    InfoToReservationComponent,
    CardIncludedComponent,
    ItineraryComponent,
    IncludedComponent,
    NotIncludedComponent,
    FaqComponent,
    ManagerGalleryComponent,
  ],
  imports: [
    CommonModule,
    ToursRoutingModule,
    SharedModule,
    TranslateModule,
    CommonModule,
    FontAwesomeModule,
    TooltipModule.forRoot(),
    TimeagoModule,
    YouTubePlayerModule,
    PaginationModule.forRoot(),
    ErrorTailorModule.forRoot({
      errors: {
        useValue: {
          required: 'This field is required',
          minlength: ({ requiredLength, actualLength }) =>
            `Expect ${requiredLength} but got ${actualLength}`,
          invalidAddress: (error) => `Address isn't valid`,
        },
      },
    }),
    AvatarModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTabsModule,
    RouterModule,
    AccordionModule,
    NgxMaskModule.forRoot(),
    DndModule,
  ],
  exports: [ListToursComponent],
  providers: [DatePipe],
})
export class ToursModule { }
