import { LeaveDialogComponent } from './leave-dialog/leave-dialog.component';
import { RandomAvatarPipe } from './../../directives/random-avatar.pipe';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalWizardComponent } from './modal-wizard/modal-wizard.component';
import { LoadingbuttonDirective } from 'src/app/directives/loadingbutton.directive';
import { LoadingBtnDirective } from 'src/app/directives/loading-btn.directive';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { SideBarComponent } from './side-bar/side-bar.component';
import { NgxCopilotModule } from 'ngx-copilot';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'ngx-avatar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './header/header.component';
import { ListItemsComponent } from './list-items/list-items.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionBtnComponent } from './section-btn/section-btn.component';
import { QuillModule } from 'ngx-quill';
import { TextRichComponent } from './text-rich/text-rich.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DropGalleryComponent } from './drop-galery/drop-gallery.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LottieModule } from 'ngx-lottie';
import { DropVideoComponent } from './drop-video/drop-video.component';
import { DatesFormatDeparturePipe } from 'src/app/directives/dates-format-departure.pipe';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { StripeHtmlPipe } from '../../pipe/stripe-html.pipe';
import { LoadingComponent } from './loading/loading.component';
import { PriceAllCurrenciesPipe } from 'src/app/directives/price-all-currencies.pipe';
import { FormDepartureComponent } from '../tours/pages/departures/form-departure/form-departure.component';
import { DndModule } from 'ngx-drag-drop';
import { NgxMaskModule } from 'ngx-mask';
import { TimeagoModule } from 'ngx-timeago';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPrettyCheckboxModule } from 'ngx-pretty-checkbox';
import { NgSelectModule } from '@ng-select/ng-select';
import { ShowCategoriesPipe } from 'src/app/directives/show-categories.pipe';


@NgModule({
  declarations: [
    ModalWizardComponent,
    RandomAvatarPipe,
    LoadingBtnDirective,
    LoadingbuttonDirective,
    SideBarComponent,
    HeaderComponent,
    ListItemsComponent,
    SectionBtnComponent,
    TextRichComponent,
    DropGalleryComponent,
    DatesFormatDeparturePipe,
    LeaveDialogComponent,
    DropVideoComponent,
    StripeHtmlPipe,
    LoadingComponent,
    PriceAllCurrenciesPipe,
    FormDepartureComponent,
    ShowCategoriesPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    ModalModule.forRoot(),
    NgxLocalStorageModule.forRoot(),
    TooltipModule.forRoot(),
    AccordionModule.forRoot(),
    NgxCopilotModule,
    FontAwesomeModule,
    AvatarModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    BsDropdownModule,
    NgxDropzoneModule,
    LottieModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPrettyCheckboxModule,
    TimeagoModule,
    BsDatepickerModule.forRoot(),
    NgxMaskModule.forRoot(),
    DndModule,
  ],
  exports: [
    LoadingBtnDirective,
    DatesFormatDeparturePipe,
    SideBarComponent,
    RandomAvatarPipe,
    HeaderComponent,
    ListItemsComponent,
    SectionBtnComponent,
    TextRichComponent,
    DropGalleryComponent,
    DropVideoComponent,
    LeaveDialogComponent,
    StripeHtmlPipe,
    LoadingComponent,
    PriceAllCurrenciesPipe,
    FormDepartureComponent,
    ShowCategoriesPipe
  ],
})
export class SharedModule { }
