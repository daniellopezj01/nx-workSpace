import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash'

@Component({
  selector: 'app-agency-offered',
  templateUrl: './agency-offered.component.html',
  styleUrls: ['./agency-offered.component.scss']
})
export class AgencyOfferedComponent implements OnInit {
  @Input() tour: any;
  public agency: any
  constructor(private router: Router) { }

  ngOnInit(): void {
    const { agency } = this.tour
    if (agency?.length) {
      this.agency = _.head(agency)
    }
  }

  goToProfile() {
    const { _id } = this.agency
    this.router.navigate(['profile', _id])
  }

}
