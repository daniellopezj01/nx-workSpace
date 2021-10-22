import { RestService } from './../../../../services/rest/rest.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-details-support',
  templateUrl: './details-support.component.html',
  styleUrls: ['./details-support.component.scss']
})

export class DetailsSupportComponent implements OnInit {
  public id: any;
  public loading = false;
  public data: any;
  public customData: any;
  public history: any = [
    {
      name: 'soporte',
      router: ['/support'],
    },
    {
      name: 'Detalles',
      router: null,
    },
  ];

  constructor(
    public share: SharedService,
    private active: ActivatedRoute,
    private rest: RestService
  ) { }

  ngOnInit(): void {
    this.active.params.subscribe(params => {
      this.id = (params['id']) //log the value of id
      this.loadinfo()
    });
    this.share.changeHistory.emit(this.history);
  }

  travelerName() {
    const { travelerFirstName, travelerLastName } = this.customData
    return `${travelerFirstName} ${travelerLastName || ''}`
  }

  loadinfo() {
    this.loading = true;
    this.rest.get(`support/${this.id}`).subscribe(res => {
      this.data = res
      const { customData } = this.data
      this.customData = customData;
      this.loading = false
    }, err => {
      console.log(err)
    })
  }

}
