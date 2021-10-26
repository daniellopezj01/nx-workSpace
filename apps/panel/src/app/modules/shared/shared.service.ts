import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import {ModalUpdateComponent} from './components/modal-update/modal-update.component';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { LocalStorageService } from 'ngx-localstorage';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  @Output() registerUser = new EventEmitter<string>();
  public categories: any = [];
  @Output() common = new EventEmitter<any>();
  @Output() addPurchase = new EventEmitter<any>();
  @Output() saveIncluded = new EventEmitter<any>();
  @Output() tourData = new EventEmitter<any>();
  @Output() saveTour = new EventEmitter<any>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() copilot = new EventEmitter<any>();
  @Output() limitAccount = new EventEmitter<any>();
  @Output() changeSetting = new EventEmitter<any>();
  @Output() deleteTour = new EventEmitter<any>();
  @Output() saveItinerary = new EventEmitter<any>();
  @Output() saveDeparture = new EventEmitter<any>();
  @Output() saveOrder = new EventEmitter<any>();
  @Output() updateDeparture = new EventEmitter<any>();
  @Output() changeHistory = new EventEmitter<any>();
  @Output() updateReservation = new EventEmitter<any>();
  @Output() updateTour = new EventEmitter<any>();

  callbackValueTextRich = new EventEmitter<any>();
  setFilesTextRich = new EventEmitter<any>();

  bsModalRef?: BsModalRef;

  public loadingButtons = false;

  result: EventEmitter<any> = new EventEmitter();

  cbResult = (res: any) => this.result.emit(res);

  constructor(
    private router: Router,
    private cookie: CookieService,
    private title: Title,
    private storageService: LocalStorageService,
    private translate: TranslateService,
  ) { }

  public get getLoadingButton(): boolean {
    return this.loadingButtons;
  }

  public set setLoadingButton(v: boolean) {
    this.loadingButtons = v;
  }

  updateTitle = (title: string) => {
    this.title.setTitle(title);
  };

  playBeep = () => {
    const audio = new Audio('assets/media/alert.mp3');
    audio.load();
    audio.play();

    let title = this.title.getTitle();
    title = title.replace('🔔', '');
    this.title.setTitle(`🔔 ${title}`);
  };

  generate = (length: any) => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  public parseData = (data: any, source: string = '') => {
    try {
      const tmp: any = [];
      data.docs.map((a: any) =>
        tmp.push({
          ...a,
          ...{
            router: ['/', source, a._id],
          },
        })
      );
      return tmp;
    } catch (e) {
      return null;
    }
  };

  public goTo = (source: string = '') =>
    this.router.navigate(['/', source, 'add']);

  public findInvalidControls(form: any) {
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  copyText = (element: any) => {
    const textToCopy = element;
    const myTemporaryInputElement = document.createElement('input') as any;
    myTemporaryInputElement.type = 'text';
    myTemporaryInputElement.style.cssText =
      'opacity: 0;position: fixed;left: 0;';
    myTemporaryInputElement.value = textToCopy;
    document.body.appendChild(myTemporaryInputElement);
    myTemporaryInputElement.select();
    document.execCommand('Copy');
  };

  public nextPage = (data: any) => {
    return data.nextPage;
  };

  public parseLoad = (src: string = '', source: string = '', fields = []) => {
    let q: (string | any[])[] = [source];
    q = fields.length
      ? [...q, ...fields]
      : [...q, ...[`?fields=name`, `&sort=name&order=-1`]];

    if (src && src.length > 2) {
      q.push(`&filter=${src}`);
    }
    return q;
  };

  public toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  public openCopilot = (section: any = null) =>
    new Promise((resolve, reject) => {
      try {
        if (section) {
          const copilot = this.cookie.get(section)
            ? this.cookie.get(section)
            : null;
          if (copilot) {
            resolve(copilot);
          } else {
            resolve(null);
          }
        }
      } catch (e) {
        reject(null);
      }
    });

  public saveCopilot = (section: any = null) =>
    new Promise((resolve, reject) => {
      try {
        this.cookie.set(section, '1', 365, '/');
        resolve(true);
      } catch (e) {
        reject(null);
      }
    });

  public confirm = () =>
    new Promise((resolve, reject) => {
      this.translate.get('GENERAL').subscribe((res: any) => {
        const { ARE_YOU_SURE, ARE_YOU_SURE_SENTENCE, OK, ANY_ISSUE } = res;
        const objectDialog: any = {
          title: ARE_YOU_SURE,
          text: ARE_YOU_SURE_SENTENCE,
          icon: null,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: OK,
          footer: '<a href>' + ANY_ISSUE + '</a>',
        }

        Swal.fire(objectDialog).then((result) => {
          if (result.value) {
            resolve(true);
          } else {
            reject(false);
          }
        })
          .then();
      });
    });

  public openUpdateModal = (data: any = {}) => {
    const initialState = {
      section: data,
    };
    // this.bsModalRef = this.modalService.show(
    //   ModalUpdateComponent,
    //   Object.assign({initialState}, {
    //     class: 'modal-light-upgrade',
    //     ignoreBackdropClick: true
    //   })
    // );
  };

  public getUserInfo = () => {
    try {
      return JSON.parse(this.cookie.get('user'));
    } catch (e) {
      return null;
    }
  };

  public getSettings = (field: any = null) => {
    try {
      return field
        ? this.storageService.get('settings')[field]
        : this.storageService.get('settings');
    } catch (e) {
      return {
        name: '',
        logo: '',
      };
    }
  };

  public checkRole = (roles: any = []): boolean => {
    try {
      let data = this.getUserInfo();
      data = data ? data : [];
      return roles.includes(data?.role);
    } catch (e) {
      return false;
    }
  };


  public getPlugins = () => {
    try {
      return this.storageService.get('plugins');
    } catch (e) {
      return [];
    }
  };
}
