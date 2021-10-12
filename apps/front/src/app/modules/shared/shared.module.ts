import { QuillModule } from 'ngx-quill';
import { NgModule } from '@angular/core';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
} from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { HeaderEmptyComponent } from './header-empty/header-empty.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalMediaComponent } from './modal-media/modal-media.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { SquareComponent } from './square/square.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'ngx-bootstrap/rating';
import { TimeagoModule } from 'ngx-timeago';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HighlightDirective } from './highlight.directive';
import { DropdownAccountComponent } from './dropdown-acount/dropdown-account.component';
import { InputSearchComponent } from './input-search/input-search.component';
import { NgxStarsModule } from 'ngx-stars';
import { ReadMoreComponent } from './read-more/read-more.component';
import { MapTourComponent } from './map-tour/map-tour.component';
import { MainModalMapItineraryComponent } from './map-itinerary-global/main-modal-map-itinerary/main-modal-map-itinerary.component';
import { SectionItineraryComponent } from './map-itinerary-global/section-itinerary/section-itinerary.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TemplateDealsComponent } from './templates-Headers/template-deals/template-deals.component';
import { TemplateDestinationsComponent } from './templates-Headers/template-destinations/template-destinations.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TemplateWayTravelComponent } from './templates-Headers/template-way-travel/template-way-travel.component';
import { FilterDataPipe } from '../../filter-data.pipe';
import { SortByPipe } from '../../sort-by.pipe';
import { LoadingBtnDirective } from './loadingbutton.directive';
import { CurrencyFlightPipe } from '../../currency-flight.pipe';
import { LastValuePipe } from '../../last-value.pipe';
import { FirstValuePipe } from '../../first-value.pipe';
import { ConvertTimeClearPipe } from '../../convert-time-clear.pipe';
import { AvatarModule } from 'ngx-avatar';
import { DatesFormatDeparturePipe } from '../../dates-format-departure.pipe';
import { MessageInboxComponent } from '../message-inbox/message-inbox.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { UserChatPipe } from '../../user-chat.pipe';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { MessageCardInComponent } from '../message-card-in/message-card-in.component';
import { FocusMeDirective } from '../../focus-me.directive';
import { ImageFallDirective } from '../../image-fall.directive';
import { StriphtmlPipe } from '../../striphtml.pipe';
import { ReverserPipe } from '../../reverser.pipe';
import { EyePasswordDirective } from '../../eye-password.directive';
import { CurrencyCurrentPipe } from '../../currency-current.pipe';
import { OnlyBrowserDirective } from '../../only-browser.directive';
import { CountDownTimePipe } from './count-down-time.pipe';
import { SearchHotelsComponent } from './search-hotels/search-hotels.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SearchFligthsComponent } from './search-fligths/search-fligths.component';
import { FormLoginRegisterComponent } from './form-login-register/form-login-register.component';
import { DiscountPricePipe } from './pipe/discount-price.pipe';
import { SavePayingAllPipe } from './pipe/save-paying-all.pipe';
import { PayPercentagePipe } from './pipe/pay-percentage.pipe';
import { SmallPercentagePipe } from './pipe/small-percentage.pipe';
import { ModalAlertComponent } from './modal-alert/modal-alert.component';
import { DateMonthPipe } from './pipe/date-month.pipe';
import { CardTourComponent } from '../search/pages/tours/card-tour/card-tour.component';
import { LoadingComponent } from './loading/loading.component';
import { TextRichComponent } from './text-rich/text-rich.component';
import { VisibilityDirective } from '../../visibility.directive';
import { BreadCrumbComponent } from './bread-crumb/bread-crumb.component';
import { TransformNamePipe } from './transform-name.pipe';
import { NumberCountriesPipe } from './number-countries.pipe';
import { EmptyComponent } from './empty/empty.component';
import { GlobalErrorComponent } from './global-error/global-error.component';
import { RouteTranslatePipe } from './pipe/route-translate.pipe';
import { AgencyOfferedComponent } from './agency-offered/agency-offered.component';
import { BeginTourComponent } from './begin-tour/begin-tour.component';
import { ScoreComponent } from './score/score.component';
// import { NgxLocalStorageModule } from 'ngx-localstorage';

@NgModule({
  declarations: [
    HighlightDirective,
    LoadingBtnDirective,
    HeaderComponent,
    FooterComponent,
    MapTourComponent,
    HeaderEmptyComponent,
    ModalMediaComponent,
    SquareComponent,
    ReviewsComponent,
    SidebarComponent,
    DropdownAccountComponent,
    InputSearchComponent,
    ReadMoreComponent,
    MainModalMapItineraryComponent,
    SectionItineraryComponent,
    TemplateDealsComponent,
    TemplateDestinationsComponent,
    TemplateWayTravelComponent,
    FilterDataPipe,
    SortByPipe,
    CurrencyFlightPipe,
    LastValuePipe,
    FirstValuePipe,
    ConvertTimeClearPipe,
    DatesFormatDeparturePipe,
    MessageInboxComponent,
    UserChatPipe,
    MessageCardInComponent,
    FocusMeDirective,
    ImageFallDirective,
    StriphtmlPipe,
    ReverserPipe,
    EyePasswordDirective,
    CurrencyCurrentPipe,
    OnlyBrowserDirective,
    CountDownTimePipe,
    SearchHotelsComponent,
    SearchFligthsComponent,
    FormLoginRegisterComponent,
    DiscountPricePipe,
    SavePayingAllPipe,
    PayPercentagePipe,
    SmallPercentagePipe,
    ModalAlertComponent,
    VisibilityDirective,
    DateMonthPipe,
    CardTourComponent,
    LoadingComponent,
    TextRichComponent,
    BreadCrumbComponent,
    TransformNamePipe,
    NumberCountriesPipe,
    EmptyComponent,
    GlobalErrorComponent,
    RouteTranslatePipe,
    AgencyOfferedComponent,
    BeginTourComponent,
    ScoreComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    // NgxLocalStorageModule.forRoot(),
    AvatarModule,
    FontAwesomeModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,
    ModalModule.forRoot(),
    TimeagoModule,
    RatingModule.forRoot(),
    AccordionModule.forRoot(),
    QuillModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgxStarsModule,
    CarouselModule,
    PerfectScrollbarModule,
    BsDatepickerModule.forRoot(),
    NgxLinkifyjsModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    HeaderEmptyComponent,
    LoadingBtnDirective,
    SquareComponent,
    ReviewsComponent,
    InputSearchComponent,
    ReadMoreComponent,
    HighlightDirective,
    MapTourComponent,
    FilterDataPipe,
    SortByPipe,
    CurrencyFlightPipe,
    LastValuePipe,
    FirstValuePipe,
    ConvertTimeClearPipe,
    DatesFormatDeparturePipe,
    MessageInboxComponent,
    FocusMeDirective,
    ImageFallDirective,
    StriphtmlPipe,
    ReverserPipe,
    DiscountPricePipe,
    SavePayingAllPipe,
    EyePasswordDirective,
    CurrencyCurrentPipe,
    OnlyBrowserDirective,
    SearchHotelsComponent,
    SearchFligthsComponent,
    FormLoginRegisterComponent,
    SmallPercentagePipe,
    DateMonthPipe,
    CardTourComponent,
    LoadingComponent,
    TextRichComponent,
    VisibilityDirective,
    BreadCrumbComponent,
    TransformNamePipe,
    NumberCountriesPipe,
    EmptyComponent,
    GlobalErrorComponent,
    RouteTranslatePipe,
    AgencyOfferedComponent,
    BeginTourComponent,
    ScoreComponent
  ],
  providers: [DecimalPipe, CurrencyPipe, DatePipe],
})
export class SharedModule { }
