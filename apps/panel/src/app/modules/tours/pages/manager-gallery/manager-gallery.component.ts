/* eslint-disable @typescript-eslint/no-empty-function */
import { RestService } from './../../../../services/rest/rest.service';
import { MediaService } from './../../../shared/drop-galery/media.service';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as _ from 'lodash';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { IncludedService } from '../../services/included.service';

@Component({
  selector: 'app-manager-gallery',
  templateUrl: './manager-gallery.component.html',
  styleUrls: ['./manager-gallery.component.scss']
})
export class ManagerGalleryComponent implements OnInit {

  @Input() id: any;
  @Input() tour: any;
  public form: FormGroup;
  public optionsVideo = ['save'];
  public apiLoaded = false;
  public idVideo = '';
  public player?: YT.Player;
  public updateGallery = false

  constructor(
    public media: MediaService,
    private formBuilder: FormBuilder,
    private rest: RestService,
    private cdref: ChangeDetectorRef,
    private includesService: IncludedService,
  ) {
    const p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    this.form = this.formBuilder.group({
      urlVideo: ['', [Validators.required, Validators.pattern(p)]],
    });
  }

  ngOnInit(): void {
    this.media.files = [];

    const { video, attached } = this.tour;
    this.media.files = [...attached];
    this.updateGallery = !attached.length
    if (video) {
      this.optionsVideo.push('trash');
      this.idVideo = video;
    }
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  ngAfterContentChecked(): any {
    this.cdref.detectChanges();
  }

  parseImage = ({ source }: any) => {
    if (source) {
      return source?.small
    };
  }

  onDrop(event: DndDropEvent, list?: any[]): any {
    if (list && ['copy', 'move'].includes(event.dropEffect)) {
      let index = event.index;
      console.log(index)
      if (typeof index === 'undefined') {
        index = list.length;
      }
      list.splice(index, 0, event.data);
    }
  }

  onDragged(item: any, list: any[], effect: DropEffect, group: any): any {
    if (effect === 'move') {
      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }

  onDragEnd(event: DragEvent, group: any): any {
    const body = { ...{ attached: group } };
    console.log(body)
    this.includesService
      .updateIncluded(this.tour?._id, body)
      .subscribe((res) => { });

  }

  async updateImages(): Promise<any> {
    let attached;
    await this.media.loadImages().then((res: any) => {
      attached = _.concat(res, []);
    });
    this.rest.patch(`tours/${this.tour._id}`, { attached }).subscribe((res) => {
      this.rest.toastSuccess(
        'Se ha actualizado la galeria del Tour exitosamente.',
        'Tour Actualizado'
      );
      this.media.files = res.attached;
    });
  }

  handleChangeInputVideo(e: any) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = e.match(regExp);
    this.idVideo = match && match[7].length == 11 ? match[7] : false;
    if (this.idVideo && this.player) {
      setTimeout(() => {
        this.player?.loadVideoById(this.idVideo);
      }, 100);
    }
  }

  ready($event: any) {
    this.player = $event.target;
    if (this.idVideo) {
      this.player?.loadVideoById(this.idVideo);
    }
  }

  saveVideo() {
    const object = { video: this.idVideo };
    this.rest.patch(`tours/${this.id}`, object).subscribe((res) => {
      this.rest.toastSuccess(
        'Se ha actualizado el tour del Tour exitosamente.',
        'Tour Actualizado'
      );
      this.optionsVideo.push('trash');
    });
  }

  deleteVideo() {
    const object = { video: '' };
    this.rest.patch(`tours/${this.id}`, object).subscribe((res) => {
      const { video } = res;
      this.rest.toastSuccess(
        'Se ha actualizado el tour del Tour exitosamente.',
        'Tour Actualizado'
      );
      this.idVideo = video;
      this.form.reset();
      this.player?.loadVideoById(this.idVideo);
      _.remove(this.optionsVideo, (i) => i == 'trash');
    });
  }
}
