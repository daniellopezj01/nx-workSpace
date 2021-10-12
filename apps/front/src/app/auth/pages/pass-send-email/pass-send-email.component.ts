import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pass-send-email',
  templateUrl: './pass-send-email.component.html',
  styleUrls: ['./pass-send-email.component.scss'],
})
export class PassSendEmailComponent implements OnInit {
  constructor(private router: Router, private translate: TranslateService) {}

  ngOnInit(): void {}

  goto() {
    this.router.navigate(['/']);
  }
}
