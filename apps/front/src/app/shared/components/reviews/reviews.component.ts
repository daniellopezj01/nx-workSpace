import { Component, OnInit, Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  @Input() type: any;
  @Input() id: any;
  @Input() loading = true;
  @Input() data: any;
  @Input() numberItems: any;
  user: any;
  form: FormGroup;
  value: Observable<number>;

  constructor(
    private cookies: CookieService,
    private formBuilder: FormBuilder,
    private rest: RestService
  ) { }

  ngOnInit() {
    this.user = this.rest.getCurrentUser();
    this.form = this.formBuilder.group({});
  }
}
