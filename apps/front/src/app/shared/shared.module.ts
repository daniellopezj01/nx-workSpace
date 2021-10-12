import { QuillModule } from 'ngx-quill';
import { NgModule } from '@angular/core';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
} from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalModule } from 'ngx-bootstrap/modal';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { HighlightDirective } from './directives/highlight.directive';
import { LoadingBtnDirective } from './directives/loadingbutton.directive';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MapTourComponent } from './components/map-tour/map-tour.component';
import { HeaderEmptyComponent } from './components/header-empty/header-empty.component';
import { ModalMediaComponent } from './components/modal-media/modal-media.component';
import { SquareComponent } from './components/square/square.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DropdownAccountComponent } from './components/dropdown-acount/dropdown-account.component';
import { InputSearchComponent } from './components/input-search/input-search.component';
import { ReadMoreComponent } from './components/read-more/read-more.component';
// tslint:disable-next-line:max-line-length
import { MainModalMapItineraryComponent } from './components/map-itinerary-global/main-modal-map-itinerary/main-modal-map-itinerary.component';
import { SectionItineraryComponent } from './components/map-itinerary-global/section-itinerary/section-itinerary.component';
import { TemplateDealsComponent } from './components/templates-headers/template-deals/template-deals.component';
import { TemplateDestinationsComponent } from './components/templates-headers/template-destinations/template-destinations.component';
import { TemplateWayTravelComponent } from './components/templates-headers/template-way-travel/template-way-travel.component';
import { FilterDataPipe } from './pipes/filter-data.pipe';
import { SortByPipe } from './pipes/sort-by.pipe';
import { CurrencyFlightPipe } from './pipes/currency-flight.pipe';
import { LastValuePipe } from './pipes/last-value.pipe';
import { FirstValuePipe } from './pipes/first-value.pipe';
import { ConvertTimeClearPipe } from './pipes/convert-time-clear.pipe';
import { DatesFormatDeparturePipe } from './pipes/dates-format-departure.pipe';
import { MessageInboxComponent } from '../inbox/components/message-inbox/message-inbox.component';
import { UserChatPipe } from './pipes/user-chat.pipe';
import { MessageCardInComponent } from '../inbox/components/message-card-in/message-card-in.component';
import { FocusMeDirective } from './directives/focus-me.directive';
import { ImageFallDirective } from './directives/image-fall.directive';
import { StriphtmlPipe } from './pipes/striphtml.pipe';
import { ReverserPipe } from './pipes/reverser.pipe';
import { EyePasswordDirective } from './directives/eye-password.directive';
import { CurrencyCurrentPipe } from './pipes/currency-current.pipe';
import { OnlyBrowserDirective } from './directives/only-browser.directive';
import { CountDownTimePipe } from './pipes/count-down-time.pipe';
import { SearchHotelsComponent } from './components/search-hotels/search-hotels.component';
import { SearchFligthsComponent } from './components/search-fligths/search-fligths.component';
import { FormLoginRegisterComponent } from './components/form-login-register/form-login-register.component';
import { DiscountPricePipe } from './pipes/discount-price.pipe';
import { SavePayingAllPipe } from './pipes/save-paying-all.pipe';
import { PayPercentagePipe } from './pipes/pay-percentage.pipe';
import { SmallPercentagePipe } from './pipes/small-percentage.pipe';
import { ModalAlertComponent } from './components/modal-alert/modal-alert.component';
import { VisibilityDirective } from './directives/visibility.directive';
import { DateMonthPipe } from './pipes/date-month.pipe';
import { CardTourComponent } from '../search/pages/tours/card-tour/card-tour.component';
import { LoadingComponent } from './components/loading/loading.component';
import { TextRichComponent } from './components/text-rich/text-rich.component';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { TransformNamePipe } from './pipes/transform-name.pipe';
import { NumberCountriesPipe } from './pipes/number-countries.pipe';
import { EmptyComponent } from './components/empty/empty.component';
import { GlobalErrorComponent } from './components/global-error/global-error.component';
import { RouteTranslatePipe } from './pipes/route-translate.pipe';
import { AgencyOfferedComponent } from './components/agency-offered/agency-offered.component';
import { BeginTourComponent } from './components/begin-tour/begin-tour.component';
import { ScoreComponent } from './components/score/score.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AvatarModule } from 'ngx-avatar';
import { TimeagoModule } from 'ngx-timeago';
import { RatingModule } from 'ngx-bootstrap/rating';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxStarsModule } from 'ngx-stars';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { LazyImageDirective } from './directives/lazy-image.directive';
import { TourLanguageOfferedComponent } from './components/tour-language-offered/tour-language-offered.component';
import { FirstLineComponent } from './components/header/components/first-line/first-line.component';
import { ContactComponent } from './components/header/components/contact/contact.component';
import { RoundUpPipe } from './pipes/round-up.pipe';
import { SquareListComponent } from './components/square-list/square-list.component';

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
    LazyImageDirective,
    TourLanguageOfferedComponent,
    FirstLineComponent,
    ContactComponent,
    RoundUpPipe,
    SquareListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
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
    NgxLinkifyjsModule
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
    ScoreComponent,
    TourLanguageOfferedComponent,
    SquareListComponent
  ],
  providers: [DecimalPipe, CurrencyPipe, DatePipe],
})

// @ts-ignore
export class SharedModule {
}
