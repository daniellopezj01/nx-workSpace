import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-change',
  templateUrl: './success-change.component.html',
  styleUrls: ['./success-change.component.scss'],
})
export class SuccessChangeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goto() {
    this.router.navigate(['/auth/login']);
  }
}
