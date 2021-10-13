import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservationService } from '../../reservation.service';
import * as _ from 'lodash';
import * as  FileSaver from 'file-saver';

@Component({
  selector: 'app-important-info',
  templateUrl: './important-info.component.html',
  styleUrls: ['./important-info.component.scss']
})
export class ImportantInfoComponent implements OnInit {
  loading = false;
  codeReservation: any;
  info: any;
  public beginTour: any;

  constructor(private service: ReservationService, private activeRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.codeReservation = this.activeRouter.snapshot?.parent?.params.id;
    this.service.setCode(this.codeReservation);
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    const data = await this.service.getData();
    this.info = data?.departure?.infoToReservation;
    this.loading = false;
  }

  donwload() {
    const { attached } = this.info;
    _.map(attached, a => {
      const original = a?.source?.original;
      const data = original.split('-');
      const fileName = _.last(data);
      FileSaver.saveAs(original, fileName || original);
    });
  }
}
