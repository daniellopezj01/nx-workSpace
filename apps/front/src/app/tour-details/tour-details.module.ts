import { CardFeaturedComponent } from './pages/featured/card-featured/card-featured.component';
import { ContainerFeaturedComponent } from './pages/featured/container-featured/container-featured.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TourDetailsRoutingModule } from './tour-details-routing.module';
import { MainDetailsComponent } from './pages/main-details/main-details.component';
import { SharedModule } from '../shared/shared.module';
import { HeaderDetailsComponent } from './pages/header-details/header-details.component';
import { NgxStarsModule } from 'ngx-stars';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AboutTourComponent } from './pages/about-tour/about-tour.component';
import { ItineraryTourComponent } from './pages/itinerary-tour/itinerary-tour.component';
import { InViewportModule } from 'ng-in-viewport';
import { DetailsItineraryComponent } from './pages/details-itinerary/details-itinerary.component';
import { ContainerReviewsComponent } from './pages/reviews/container-reviews/container-reviews.component';
import { AllReviewsComponent } from './pages/reviews/all-reviews/all-reviews.component';
import { StarsReviewsComponent } from './pages/reviews/stars-reviews/stars-reviews.component';
import { CardReviewComponent } from './pages/reviews/card-review/card-review.component';
import { TimeagoModule } from 'ngx-timeago';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterReviewsComponent } from './pages/reviews/filter-reviews/filter-reviews.component';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AvatarModule } from 'ngx-avatar';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { IncludesComponent } from './pages/includes/includes.component';
import { FaqTourComponent } from './pages/faq-tour/faq-tour.component';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { SearchModule } from '../search/search.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { GeneralInfoComponent } from './pages/general-info/general-info.component';
import { ExternalHeaderComponent } from './pages/external-header/external-header.component';
import { MainHeaderComponent } from './pages/main-header/main-header.component';
import { MoreInfoComponent } from './components/more-info/more-info.component';


@NgModule({
  declarations: [
    MainDetailsComponent,
    HeaderDetailsComponent,
    AboutTourComponent,
    ItineraryTourComponent,
    DetailsItineraryComponent,
    ContainerReviewsComponent,
    AllReviewsComponent,
    StarsReviewsComponent,
    CardReviewComponent,
    FilterReviewsComponent,
    IncludesComponent,
    MoreInfoComponent,
    FaqTourComponent,
    ContainerFeaturedComponent,
    CardFeaturedComponent,
    GeneralInfoComponent,
    ExternalHeaderComponent,
    MainHeaderComponent,
  ],
  imports: [
    CommonModule,
    TourDetailsRoutingModule,
    YouTubePlayerModule,
    SharedModule,
    NgxStarsModule,
    FontAwesomeModule,
    InViewportModule,
    TimeagoModule,
    TranslateModule,
    ModalModule.forRoot(),
    GalleryModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    PerfectScrollbarModule,
    AvatarModule,
    SearchModule,
    NgxLinkifyjsModule,
    AccordionModule,
  ],
  exports: [
    FaqTourComponent,
    IncludesComponent,
    ItineraryTourComponent
  ]
})

// @ts-ignore
export class TourDetailsModule { }
