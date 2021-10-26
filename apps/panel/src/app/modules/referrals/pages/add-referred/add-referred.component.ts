import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-add-referred',
  templateUrl: './add-referred.component.html',
  styleUrls: ['./add-referred.component.scss'],
})
export class AddReferredComponent implements OnInit {
  public id: any = false;

  constructor(
    private route: ActivatedRoute,
    private share: SharedService,
    public router: Router
  ) { }

  public history: any = [
    {
      name: 'referrals',
      router: ['/'],
    },
    {
      name: 'Detalle',
      router: null,
    },
  ];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params.id === 'add' ? '' : params.id;
    });
  }


}
