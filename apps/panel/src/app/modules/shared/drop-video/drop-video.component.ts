import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { faHandPointer } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SharedService } from '../shared.service';
import { MediaVideoService } from './media-video.service';

@Component({
  selector: 'app-drop-video',
  templateUrl: './drop-video.component.html',
  styleUrls: ['./drop-video.component.scss'],
})
export class DropVideoComponent implements OnInit {
  @Output() cbAdded = new EventEmitter<any>();
  @Input() public removeMargin = true;
  @Input() public multiple = false;
  @Input() public singleFile = true;

  public disabledClick = false;
  private animationItem?: AnimationItem;
  public faHandPointer = faHandPointer;
  public bsModalRef?: BsModalRef;
  public options: AnimationOptions = {
    path: '/assets/images/click.json',
  };

  constructor(
    public share: SharedService,
    public media: MediaVideoService,
    private ngZone: NgZone,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    if (this.singleFile && this.media.files.length) {
      this.disabledClick = true;
    }
    this.media.deleteVideo.subscribe((res) => {
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

  cbSwipe($event: any) {
    this.media.items = this.media.items.filter((a: any) => {
      return !Object.values(a).includes($event);
    });
  }

  viewVideo = (e: any, data: any = {}) => {
    e.stopPropagation();
    this.open(data);
  };

  open(data: any = null) {
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

  onRemove(event: any, i: any) {
    this.media.files.splice(i, 1);
    this.cbAdded.emit(event);
    if (this.singleFile && !this.media.files.length) {
      this.disabledClick = false;
    }
  }

  onSelect(event: NgxDropzoneChangeEvent) {
    this.media.processFile({ files: event.addedFiles });
    this.cbAdded.emit(event);
    if (this.singleFile) {
      this.disabledClick = true;
    }
  }

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
    // this.animationItem.stop();
  }

  loopComplete(e: any): void {
    // e.stop().then();
    this.pause();
  }

  stop(): void {
    this.ngZone.runOutsideAngular(() => this.animationItem?.stop());
  }

  pause(): void {
    this.ngZone.runOutsideAngular(() => this.animationItem?.setSegment(43, 44));
  }
}
