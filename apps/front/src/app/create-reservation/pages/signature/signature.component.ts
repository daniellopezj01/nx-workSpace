import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewChecked,
} from '@angular/core';
import * as _ from 'lodash';
import { MediaService } from '../../../core/services/media.service';
import { ModalsService } from '../../../core/services/modals.service';
import { RestService } from '../../../core/services/rest.service';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
})
export class SignatureComponent implements OnInit, AfterViewChecked {
  @ViewChild('SignaturePad') signaturePad: any;
  @ViewChild('containerSignature') containerSignature: ElementRef | undefined;
  public dimensions: any;
  public signaturePadOptions = {
    minWidth: 1,
    penColor: 'rgb(0, 0, 0)',
    canvasWidth: 300,
    canvasHeight: 350,
  };
  public image: any;
  public loading: boolean = false;

  constructor(
    private modalService: ModalsService,
    private media: MediaService,
    private render: Renderer2,
    private rest: RestService,
    private shared: SharedService
  ) { }

  ngOnInit(): void { }

  closeModal() {
    this.modalService.close();
  }

  ngAfterViewChecked(): void {
    if (!this.dimensions) {
      const parent = this.containerSignature?.nativeElement;
      if (parent.getBoundingClientRect().width) {
        this.dimensions = parent.getBoundingClientRect();
        this.changeRender();
      }
    }
  }

  changeRender() {
    const canvas = document.querySelector('.style-signature canvas');
    this.render.setAttribute(canvas, 'width', this.dimensions.width);
    this.signaturePad.clear();
  }

  drawComplete() {
    this.image = this.signaturePad.toDataURL();
  }

  drawStart() {
    // console.log('begin drawing');
  }
  clear() {
    this.image = null;
    this.signaturePad.clear();
  }

  async save() {
    if (this.image) {
      this.loading = true;
      this.image = await this.media.dataURItoBlob(this.image);
      this.image = await this.media.loadImages([this.image]);
      const signature: any = _.head(this.image);
      if (signature?.source) {
        // this.shared.loadSignature.emit(signature);
        this.closeModal();
      } else {
        this.rest.showToast('SAVE_SIGNATURE');
        this.clear();
      }
      this.loading = false;
    }
  }
}
