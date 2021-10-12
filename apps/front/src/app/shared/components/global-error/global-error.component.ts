import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-global-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.scss']
})
export class GlobalErrorComponent implements OnInit {
  @Input() errorStripe: string;
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
  constructor() { }

  ngOnInit(): void {
  }

  // ClosemodalError() {
  //   this.modalService.close();
  // }
}
