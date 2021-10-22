import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { MediaService } from './media.service';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { faHandPointer } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-drop-gallery',
  templateUrl: './drop-gallery.component.html',
  styleUrls: ['./drop-gallery.component.scss'],
})
export class DropGalleryComponent implements OnInit {
  @Output() cbAdded = new EventEmitter<any>();
  @Input() removeMargin = false;
  @Input() multiple = true;
  @Input() activeAuxArray = false;
  @Input() singleFile = false;

  public disabledClick = false;
  private animationItem?: AnimationItem;
  public faHandPointer = faHandPointer;
  public bsModalRef?: BsModalRef;
  public options: AnimationOptions = {
    path: '/assets/images/click.json',
  };

  constructor(
    public share: SharedService,
    public media: MediaService,
    private ngZone: NgZone,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.media.activeAux = this.activeAuxArray;
    if (this.activeAuxArray) {
      if (this.singleFile && this.media.auxFiles.length) {
        this.disabledClick = true;
      }
    } else {
      if (this.singleFile && this.media.files.length) {
        this.disabledClick = true;
      }
    }
    this.media.deleteImage.subscribe((res) => {
      this.disabledClick = res;
    });
  }

  parseImage = (data: any = {}) => {
    if (typeof data === 'string') {
      return data;
    } else {
      return data.source?.original ? data.source?.original : data.base;
    }
  };

  cbSwipe($event: any): any {
    this.media.items = this.media.items.filter((a: any) => {
      return !Object.values(a).includes($event);
    });
  }

  viewImage = (e: any, data: any = {}) => {
    e.stopPropagation();
    this.open(data);
  };

  open(data: any = null): any {
    // const initialState = {
    //   section: data,
    // };
    // this.bsModalRef = this.modalService.show(
    //   ModalImageComponent,
    //   Object.assign(
    //     { initialState },
    //     {
    //       class: 'modal-light-zoom',
    //       ignoreBackdropClick: false,
    //     }
    //   )
    // );
  }

  onRemove(event: any, i: any): any {
    if (this.media.activeAux) {
      this.media.auxFiles.splice(i, 1);
    } else {
      this.media.files.splice(i, 1);
    }
    this.cbAdded.emit(event);
    if (this.singleFile) {
      if (this.activeAuxArray) {
        this.disabledClick = !!this.media.auxFiles.length;
      } else {
        this.disabledClick = !!this.media.files.length;
      }
    }
  }

  onSelect(event: NgxDropzoneChangeEvent): any {
    this.media.processFile({ files: event.addedFiles });
    this.cbAdded.emit(event);
    if (this.singleFile) {
      this.disabledClick = true;
    }
  }

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
  }

  loopComplete(e: any): void {
    this.pause();
  }

  stop(): void {
    this.ngZone.runOutsideAngular(() => this.animationItem?.stop());
  }

  pause(): void {
    this.ngZone.runOutsideAngular(() => this.animationItem?.setSegment(43, 44));
  }
}
