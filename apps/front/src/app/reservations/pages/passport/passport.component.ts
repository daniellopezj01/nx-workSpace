import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {
  ValidationError,
  FilePickerComponent,
  FilePreviewModel,
} from 'ngx-awesome-uploader';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ReservationService } from '../../reservation.service';
import { ActivatedRoute } from '@angular/router';
import { DemoFilePickerAdapter } from '../../../profile/pages/media/services/demo-file-picker.adapter';
import { UpdateService } from '../../../profile/pages/media/services/update.service';
import { ModalCropMediaService } from '../../../profile/modal/modal-crop-media.service';
import { ModalCropComponent } from '../../../profile/modal/modal-crop/modal-crop.component';
import { SharedService } from '../../../core/services/shared.service';
import { RestService } from '../../../core/services/rest.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.scss']
})
export class PassportComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('uploader', { static: false }) uploader?: FilePickerComponent;
  @ViewChild('uploaderVideo', { static: false })
  public uploaderVideo?: FilePickerComponent;

  public adapter = new DemoFilePickerAdapter(
    this.http,
    this.updateService,
    this.cookies,
    false
  );
  public adapterVideo = new DemoFilePickerAdapter(
    this.http,
    this.updateService,
    this.cookies
  );
  public errorPassport = false;
  public listSubscribers: any = [];
  public loading = false;
  public imageChangedEvent: any;
  public croppedImage: any;
  public modalRef?: BsModalRef;
  public data: any;
  public codeReservation: any;

  constructor(
    private cookies: CookieService,
    private rest: RestService,
    public updateService: UpdateService,
    private http: HttpClient,
    private activeRouter: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private shared: SharedService,
    private service: ReservationService,
    private modalCropMediaService: ModalCropMediaService
  ) {
  }

  async ngOnInit() {
    this.loading = true;
    this.codeReservation = this.activeRouter.snapshot?.parent?.params.id;
    this.service.setCode(this.codeReservation);
    this.data = await this.service.getData();
    this.listObserver();
    this.loading = false;
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  // onRemoveSuccess(e: FilePreviewModel) {
  // }

  ngOnDestroy() {
    this.listSubscribers.forEach((a: Subscription) => a.unsubscribe());
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

    if (type === 'video') {
      this.errorPassport = true;
    }
  }

  onUploadSuccess($event: any) {
    const response = JSON.parse($event.fileId);
    if (response.status && response.status === 200) {
      if (response.body) {
        const { source } = response.body[0];
        const body = { imagePassPort: source };
        this.rest.patch(`reservations/${this.data._id}`, body).subscribe(
          (res: any) => {
            this.data = res;
            this.service.setData(res);
            this.updateService.hideLoading();
            this.service.uploadPassport.emit(res);
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
