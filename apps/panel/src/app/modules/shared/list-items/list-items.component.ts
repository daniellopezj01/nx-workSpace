/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { FilterItemsService } from './filter-items.service';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  faTimes,
  faPlus,
  faCalendarCheck,
  faCalendarAlt,
  faArrowLeft,
  faArrowRight,
  faFilter,
  faFilePdf,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
// import {SearchService} from "../../modules/search/search.service";
import { SharedService } from '../shared.service';
import { RestService } from '../../../services/rest/rest.service';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss'],
})
export class ListItemsComponent implements OnInit {
  @ViewChild('defaultCustom') defaultCustom?: TemplateRef<any>;
  @ViewChild('dropdown') dropdown?: BsDropdownDirective;
  @ViewChild('viewContainerCustom', { static: false, read: ViewContainerRef })
  viewContainerCustom?: ViewContainerRef;

  @Output() dataChange = new EventEmitter();
  @Output() cbSrc = new EventEmitter<any>();
  @Output() cbPdf = new EventEmitter<any>();
  @Output() cbAdd = new EventEmitter<any>();
  @Output() pagination = new EventEmitter<any>();
  @Output() cbFilter = new EventEmitter<any>();
  @Input() beginAdd: any = true;
  @Input() customTemplate?: TemplateRef<any>;
  @Input() title: any = false;
  @Input() mode: any = false;
  @Input() search: any = true;
  @Input() showIcon: any = true;
  @Input() options = this.beginAdd ? ['add'] : [];
  @Input() filtersMode = false;
  @Input() get data() {
    return this.dataIn;
  }
  public faFilter = faFilter;
  public faTimes = faTimes;
  public faCheck = faCheck;
  public faArrowLeft = faArrowLeft;
  public faArrowRight = faArrowRight;
  public dataIn: any = [];
  public faFilePdf = faFilePdf;
  public faPlus = faPlus;
  public faCalendarCheck = faCalendarCheck;
  public faCalendarAlt = faCalendarAlt;
  public src: any = null;
  set data(val) {
    this.dataIn = val;
    this.dataChange.emit(this.dataIn);
    this.ngAfterViewInit();
  }

  constructor(
    public rest: RestService,
    private cdRef: ChangeDetectorRef,
    public shared: SharedService,
    public filterService: FilterItemsService
  ) { }

  ngOnInit(): void {
    this.options = this.beginAdd ? ['add'] : [];
    this.filterService.filterCb.subscribe((res: any) => {
      this.filterService.filterSelect = this.filterService.filterSelect.filter(
        (a: any) => {
          if (a.pre.label !== res.pre.label) {
            return a;
          }
        }
      );
      this.filterService.filterSelect.push(res);
      this.cbFilter.emit({
        filters: this.filterService.filterSelect,
        concat: true,
      });
    });
  }

  ngAfterViewInit(): void {
    if (this.viewContainerCustom) {
      this.viewContainerCustom.clear();
      const viewCustomTemplate: any = this.customTemplate?.createEmbeddedView({
        dat: this.dataIn,
      });
      this.viewContainerCustom.insert(viewCustomTemplate);
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  onChange = (src: string = '') => {
    this.viewContainerCustom?.clear();
    this.cbSrc.emit(src);
  };

  callbackAdd = (a: any = {}) => this.cbAdd.emit(a);

  callPdf = (a: any = {}) => this.cbPdf.emit(a);

  callFilter = (filter: any) => {
    this.filterService.selectFilter(filter);
  };

  clearFilter = (value: any) => {
    this.filterService.filterSelect = this.filterService.removeValueSelect(
      this.filterService.filterSelect,
      value
    );
    this.cbFilter.emit({
      filters: this.filterService.filterSelect,
      concat: false,
    });
  };

  closeFilter = (close = false) => {
    this.filterService.secondData = {};
    this.filterService.stepCondition = null;
    if (close) {
      this.dropdown?.hide();
    }
  };
}
