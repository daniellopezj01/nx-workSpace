import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-global-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.scss']
})
export class GlobalErrorComponent {
  @Input() errorStripe?: string;
  errors = [
    {
      value: 'Error',
    },
    {
      value: 'Error',
    },
    {
      value: 'Error',
    }
  ];

  // ClosemodalError() {
  //   this.modalService.close();
  // }
}
