import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  faSave,
  faTrashAlt,
  faFilePdf,
  faMoneyBillAlt,
  faShareSquare,
} from '@fortawesome/free-regular-svg-icons';
import { SharedService } from '../shared.service';
import {
  faExclamation,
  faPlus,
  faList,
  faUpload,
  faReceipt,
  faCoins,
  faPrint,
  faFileExport,
} from '@fortawesome/free-solid-svg-icons';
import { RestService } from '../../../services/rest/rest.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-section-btn',
  templateUrl: './section-btn.component.html',
  styleUrls: ['./section-btn.component.scss'],
})
export class SectionBtnComponent implements OnInit {
  @ViewChild('btnList') btnList: any;
  @ViewChild('btnAdd') btnAdd: any;
  @ViewChild('btnTrash') btnTrash: any;
  @ViewChild('btnSave') btnSave: any;
  @Input() public classCustom = '';
  @Input() public insideclass = '';
  @Input() public options: any = [];
  @Input() public valid = false;
  @Output() public validChange = new EventEmitter<any>();
  @Output() public cbSave = new EventEmitter<any>();
  @Output() public cbPay = new EventEmitter<any>();
  @Output() public cbAdd = new EventEmitter<any>();
  @Output() public cbList = new EventEmitter<any>();
  @Output() public cbTrash = new EventEmitter<any>();
  @Output() public cbPdf = new EventEmitter<any>();
  @Output() public cbConvert = new EventEmitter<any>();
  public faFilePdf = faFilePdf;
  public faSave = faSave;
  public faList = faList;
  public faReceipt = faReceipt;
  public faPrint = faPrint;
  public faTrashAlt = faTrashAlt;
  public faUpload = faUpload;
  public faMoneyBillAlt = faMoneyBillAlt;
  public faPlus = faPlus;
  public faExclamation = faExclamation;
  public faShareSquare = faShareSquare;
  public faFileExport = faFileExport;
  public faCoins = faCoins;
  public copilot: any;
  public listSubscribers: any = [];
  public data: any;

  constructor(
    public shared: SharedService,
    private rest: RestService
  ) { }

  ngOnInit(): void {
    this.listObserver();
  }

  listObserver = () => {
    const observer1$ = this.shared.tourData.subscribe((res) => {
      this.data = res;
    });
    this.listSubscribers.push(observer1$);
  };

  ngOnDestroy() {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
  }

  private startCopilot = () => {
    this.copilot = false;
    this.shared.openCopilot('btnList').then((res) => {
      if (!res && this.btnList) {
        this.copilot = true;
        setTimeout(() => {
          this.btnList.show();
        }, 100);
      }
    });

    this.shared.openCopilot('btnAdd').then((res) => {
      if (!res && this.btnAdd) {
        this.copilot = true;
        setTimeout(() => {
          this.btnAdd.show();
        }, 100);
      }
    });

    this.shared.openCopilot('btnSave').then((res) => {
      if (!res && this.btnSave) {
        this.copilot = true;
        setTimeout(() => {
          this.btnSave.show();
        }, 100);
      }
    });

    this.shared.openCopilot('btnTrash').then((res) => {
      if (!res && this.btnTrash) {
        this.copilot = true;
        setTimeout(() => {
          this.btnTrash.show();
        }, 100);
      }
    });
  };

  delete = () => {
    this.shared
      .confirm()
      .then((res) => {
        this.shared.loadingButtons = true;
        this.cbTrash.emit(res);
      })
      .catch((err) => console.warn(err));
  };

  callbackAdd = (a: any = {}) => this.cbAdd.emit(a);

  callbackPdf = (a: any = {}) => this.cbPdf.emit(a);

  callbackList = (a: any = {}) => this.cbList.emit(a);

  callbackSave = (a: any = {}) => {
    this.shared.loadingButtons = true;
    this.cbSave.emit(a);
  };

  callbackPay = (a: any = {}) => this.cbPay.emit(a);

  callbackConvert = (a: any = {}) => this.cbConvert.emit(a);

  closeCopilot = (section = null, model: any) => {
    try {
      this.shared.saveCopilot(section).then(() => {
        model.hide();
        this.startCopilot();
      });
    } catch (e) {
      return null;
    }
  };
}
