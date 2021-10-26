import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-add-type-referreals',
  templateUrl: './add-type-referreals.component.html',
  styleUrls: ['./add-type-referreals.component.scss']
})
export class AddTypeReferrealsComponent implements OnInit {

  public id: any = false;

  constructor(
    private route: ActivatedRoute,
    private share: SharedService,
    public router: Router
  ) { }

  public history: any = [
    {
      name: 'Plan Referido',
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
