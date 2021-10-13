import { Component, Input, OnInit } from '@angular/core';
import { ModalsService } from 'apps/front/src/app/core/services/modals.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MoreInfoComponent } from '../../../components/more-info/more-info.component';

@Component({
  selector: 'app-card-featured',
  templateUrl: './card-featured.component.html',
  styleUrls: ['./card-featured.component.scss'],
})
export class CardFeaturedComponent implements OnInit {
  @Input() featured: any;
  constructor(private modalService: ModalsService, public device: DeviceDetectorService) {
    this.device.isDesktop()
  }

  ngOnInit(): void { }

  openModal() {
    this.modalService.openComponent(
      { data: this.featured },
      MoreInfoComponent,
      'modal-md'
    );
  }
}
