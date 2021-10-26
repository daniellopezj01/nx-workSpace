import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UpdateService } from './services/update.service';
import {
  ValidationError,
  FilePickerComponent,
  FilePreviewModel,
} from 'ngx-awesome-uploader';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalCropComponent } from '../../modal/modal-crop/modal-crop.component';
import { ModalCropMediaService } from '../../modal/modal-crop-media.service';
import { DemoFilePickerAdapter } from './services/demo-file-picker.adapter';
import { RestService } from '../../../core/services/rest.service';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
})
export class MediaComponent implements OnInit, AfterViewChecked, OnDestroy {
  squareItem = {
    title: 'USER.MEDIA.SQUARE_TITLE_MEDIA',
    description: 'USER.MEDIA.SQUARE_DESC_MEDIA',
    icon: '../../../../../assets/user/logo-media.svg',
  };

  @ViewChild('uploader', { static: false }) uploader?: FilePickerComponent;
  @ViewChild('uploaderVideo', { static: false })
  uploaderVideo?: FilePickerComponent;
  adapter = new DemoFilePickerAdapter(
    this.http,
    this.updateService,
    this.cookies,
    false
  );
  adapterVideo = new DemoFilePickerAdapter(
    this.http,
    this.updateService,
    this.cookies
  );
  errorImage = false;
  errorVideo = false;
  user: any;
  public listSubscribers: any = [];
  loading = false;
  imageChangedEvent: any;
  croppedImage: any;
  modalRef?: BsModalRef;

  constructor(
    private cookies: CookieService,
    private rest: RestService,
    public updateService: UpdateService,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private shared: SharedService,
    private modalCropMediaService: ModalCropMediaService
  ) {
    this.user = this.rest.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadData();
    this.listObserver();
  }

  loadData(): any {
    this.loading = true;
    this.rest
      .get('profile')
      .pipe(
        tap(() => (this.loading = false)),
        catchError((err) => {
          this.loading = err;
          return throwError(err);
        })
      )
      .subscribe((res: any) => {
        this.user = res;
      });
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  // onRemoveSuccess(e: FilePreviewModel) { }

  ngOnDestroy() {
    this.listSubscribers.forEach((a: any) => a.unsubscribe());
  }

  listObserver = () => {
    const observer1$ = this.modalCropMediaService.saveProfileImage.subscribe(
      (res: any) => {
        this.onUploadSuccess({ fileId: res });
      }
    );

    this.listSubscribers.push(observer1$);
  }

  onValidationError(error: ValidationError, type: string) {
    if (type === 'image') {
      this.errorImage = true;
    }
    if (type === 'video') {
      this.errorVideo = true;
    }
  }

  onUploadSuccess($event: any) {
    const response = JSON.parse($event.fileId);
    if (response.status && response.status === 200) {
      if (response.body) {
        const { source, type } = response.body[0];
        const body =
          type === 'image'
            ? { avatar: source.small }
            : { video: source.original };
        this.rest.patch(`profile`, body).subscribe(
          (res: any) => {
            this.user = res;
            this.cookies.delete('user', '/');
            this.updateService.hideLoading();
            this.rest.setCookies('user', this.user);
            this.updateService.emitUser();
          },
          (err) => {
            this.updateService.hideLoading();
          }
        );
      }
    }
  }

  openCrop(data: any) {
    this.modalRef = this.modalService.show(ModalCropComponent, {
      class: 'modal-crop modal-md',
      initialState: { data },
    });
  }

  fileChangeEvent(event: any): void {
    this.openCrop({});
    this.imageChangedEvent = event;
    this.modalCropMediaService.eventIn.emit(event);
  }
}
