import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.scss']
})
export class AgencyComponent implements OnInit {
  loading = false;
  data: any;

  constructor(private rest: RestService, private router: Router) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.rest.get('stripe/agency').subscribe(res => {
      this.data = res;
      this.loading = false;
    }, err => {
      console.log(err);
      this.router.navigate(['/user']);
    });
  }

}
