import { ModalsService } from './../../../../core/services/modals.service';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-error-handling',
  templateUrl: './error-handling.component.html',
  styleUrls: ['./error-handling.component.scss']
})
export class ErrorHandlingComponent {

  @Input() errorTitle?: string;
  @Input() errorDescription?: string;

  constructor(
    private modalService: ModalsService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }


  ClosemodalError() {
    this.modalService.close();
    if (isPlatformBrowser(this.platformId)) {
      window.location.reload()
    }
  }

}
