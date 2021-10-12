import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-agency-callback',
  templateUrl: './agency-callback.component.html',
  styleUrls: ['./agency-callback.component.scss']
})
export class AgencyCallbackComponent implements OnInit {
  loading: boolean;
  data: any;
  code: any;
  err: any;

  constructor(private rest: RestService,
    private active: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.loading = true;
    this.active.queryParams.subscribe(params => {
      const { code } = params;
      this.code = code;
    });
    this.rest.post('stripe/agency-callback', { code: this.code }, false).subscribe(res => {
      this.loading = false;
      this.data = res;
    }, err => {
      this.err = err;
      this.loading = false;
    });
  }

  goTo() {
    this.router.navigate(['/', 'user']);
  }
}
