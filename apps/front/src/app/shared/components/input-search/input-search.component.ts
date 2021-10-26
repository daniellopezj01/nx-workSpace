import { InputSearchService } from './input-search.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MainSearchService } from './../../../search/pages/main-search.service';
import { ToursService } from './../../../search/pages/tours/services/tours.service';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  faSearch,
  faTimes,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { finalize, map, tap } from 'rxjs/operators';
import { RestService } from '../../../core/services/rest.service';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss'],
})
export class InputSearchComponent
  implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('inputMainSearch') inputSearch: ElementRef | undefined;
  @Output() focusIn = new EventEmitter<any>();
  @Input() type = 'main';
  @Input() idInput = 'inputMainSearch';
  data$: Observable<any> | undefined;
  dataTap: any;
  sendForm: FormGroup;
  focusSearch = false;
  searchValue: any;
  loading = false;
  notFound: any = 0;
  form: FormGroup;
  squareContinents: any = [];
  listContinents: any = [];
  public listSubscribers: any = [];

  constructor(
    private library: FaIconLibrary,
    private router: Router,
    private formBuilder: FormBuilder,
    private rest: RestService,
    public translate: TranslateService,
    private cdRef: ChangeDetectorRef,
    private shared: SharedService,
    private tourService: ToursService,
    private mainService: MainSearchService,
    private inputService: InputSearchService,
    private device: DeviceDetectorService
  ) {
    library.addIcons(faSearch, faTimes, faMapMarkerAlt);
    this.sendForm = this.formBuilder.group({
      search: [''],
    });

    this.form = this.formBuilder.group({});
  }

  public get activeSmallTemplate(): boolean {
    return this.inputService.getActiveSmallTemplate
  }

  ngOnInit(): void {
    this.listObserver();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  listObserver = () => {
    const observer2$ = this.shared.dataContinents.subscribe((res: any) => {
      const list = _.orderBy(res, ['count'], ['desc'])
      this.squareContinents = list.slice(0, 3);
      this.listContinents = list.slice(3);
    });
    this.shared.getContinents();
    this.listSubscribers = [observer2$];
  }

  onFocus() {
    this.focusSearch = true;
    if (!this.device.isDesktop()) {
      setTimeout(() => {
        this.inputService.setActiveSmallTemplateh(true)
        this.inputService.setGlobalFocusSearch(this.focusSearch)
      }, 5);
    }
  }

  onBlur(event = null) {
    if (this.device.isDesktop()) {
      this.disabledTemplate()
    } else if (!this.device.isDesktop() && !event) {
      this.inputService.setActiveSmallTemplateh(false)
      this.disabledTemplate()
    }
  }

  disabledTemplate() {
    setTimeout(() => {
      this.focusSearch = false;
      this.inputService.setGlobalFocusSearch(this.focusSearch)
      this.data$ = undefined;
      this.notFound = 0;

    }, 10);
    setTimeout(() => {
      this.searchValue = null;
    }, 200);
  }

  onSearchChange(event: string) {
    this.searchValue = event;
    if (event) {
      this.loading = true;
      this.data$ = this.rest.get(`tours/search?query=${event}&lang=es`).pipe(
        finalize(() => (this.loading = false)),
        tap((a) => {
          this.dataTap = a;
          this.notFound = _.flattenDeep(_.values(a)).length;
        }),
        map((a) => _.reverse(_.values(a)))
      );
    }
  }

  goToSearch(citySelected = null) {
    const cityInList: any = _.head(this.dataTap?.places);
    let queryParams: any = this.mainService.getParamsKey()
    const currentCity = citySelected || cityInList
    if (currentCity) {
      const { id, cityName } = currentCity;
      queryParams = {
        cityId: id,
        cityName: cityName,
      };
    }
    if (this.searchValue) {
      queryParams.query = this.searchValue
    }
    this.onBlur();
    if (this.router.url.includes('search')) {
      this.mainService.setParams(queryParams, this.tourService)
    } else {
      this.router.navigate(['/', 'search'], { queryParams });
    }

  }

  goToTour(tour: any): void {
    this.router.navigate([`/destination/${tour.slug}`]);
  }

  closeTemplate() {
    this.shared.showCloseItem.emit(false);
    this.onBlur();
  }

  selectContinent(codeContinent: any) {
    let queryParams: any = this.mainService.getParamsKey()
    if (this.router.url.includes('search')) {
      this.mainService.setParams({ continent: codeContinent }, this.tourService)
    } else {
      queryParams = { continent: codeContinent }
      this.router.navigate([`/search/tours`], { queryParams });
    }
  }
}
