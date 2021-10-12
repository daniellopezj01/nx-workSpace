import { Component, Input, OnInit } from '@angular/core';
import { ModalsService } from '../../../core/services/modals.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
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
  constructor(private modalService: ModalsService) { }

  ngOnInit(): void {
  }

  ClosemodalError() {
    this.modalService.close();
  }
}
