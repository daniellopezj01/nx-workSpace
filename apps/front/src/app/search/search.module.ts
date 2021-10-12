import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgModule } from '@angular/core';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
} from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { MainSearchComponent } from './pages/main-search/main-search.component';
import { PopularComponent } from './pages/tours/popular/popular.component';
import { FilterComponent } from './pages/tours/filter/filter.component';
import { SharedModule } from '../shared/shared.module';
import { DiscoverComponent } from './pages/tours/discover/discover.component';
import { ContainerTourComponent } from './pages/tours/container-tour/container-tour.component';
import { ContainerFlightComponent } from './pages/flights/container-flight/container-flight.component';
import { ContainerHotelComponent } from './pages/hotels/container-hotel/container-hotel.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { NgxStarsModule } from 'ngx-stars';
import { ProgressBarModule } from 'angular-progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { PopularyHotelsComponent } from './pages/hotels/populary-hotels/populary-hotels.component';
import { CardHotelsComponent } from './pages/hotels/card-hotels/card-hotels.component';
import { FilterHotelComponent } from './pages/hotels/filter-hotel/filter-hotel.component';
import { EmptySearchComponent } from './pages/hotels/empty-search/empty-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CartFlightsComponent } from './pages/flights/cart-flights/cart-flights.component';
import { FilterFlightComponent } from './pages/flights/filter-flight/filter-flight.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxPrettyCheckboxModule } from 'ngx-pretty-checkbox';
import { ModalStopsComponent } from './pages/flights/modal-stops/modal-stops.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxMaskModule } from 'ngx-mask';
import { LogoCarriesFlightPipe } from './pages/flights/pipes/logo-carries-flight.pipe';
import { FlightDetailsComponent } from './pages/flights/flight-details/flight-details.component';
import { CardDetailsComponent } from './pages/flights/flight-details/components/card-details/card-details.component';
import { FromPnrComponent } from './pages/flights/flight-details/components/from-pnr/from-pnr.component';
import { ErrorHandlingComponent } from './pages/flights/error-handling/error-handling.component';
import { ConfirmFlightComponent } from './pages/flights/flight-details/components/confirm-flight/confirm-flight.component';
import { FlightsSectionComponent } from './pages/flights/flights-section/flights-section.component';
import { FlightBalanceComponent } from './pages/flights/flight-balance/flight-balance.component';


@NgModule({
  declarations: [
    MainSearchComponent,
    PopularComponent,
    FilterComponent,
    DiscoverComponent,
    ContainerTourComponent,
    ContainerFlightComponent,
    ContainerHotelComponent,
    PopularyHotelsComponent,
    CardHotelsComponent,
    FilterHotelComponent,
    EmptySearchComponent,
    CartFlightsComponent,
    FilterFlightComponent,
    ModalStopsComponent,
    LogoCarriesFlightPipe,
    FlightDetailsComponent,
    CardDetailsComponent,
    FromPnrComponent,
    ErrorHandlingComponent,
    ConfirmFlightComponent,
    FlightsSectionComponent,
    FlightBalanceComponent,
  ],
  imports: [
    TranslateModule,
    CommonModule,
    SearchRoutingModule,
    SharedModule,
    FontAwesomeModule,
    IvyCarouselModule,
    NgxStarsModule,
    ProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    NgxSliderModule,
    NgSelectModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot(),
    NgxPrettyCheckboxModule,
    NgxIntlTelInputModule,
  ],
  exports: [PopularComponent],
  providers: [DecimalPipe, CurrencyPipe, DatePipe],
})

// @ts-ignore
export class SearchModule { }
