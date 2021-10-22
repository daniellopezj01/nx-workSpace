import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/modules/shared/shared.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  public id: any = false;

  constructor(
    private route: ActivatedRoute,
    private share: SharedService,
    public router: Router
  ) {}

  public history: any = [
    {
      name: 'Users',
      router: ['/'],
    },
    {
      name: 'Nuevo',
      router: null,
    },
  ];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params.id === 'add' ? '' : params.id;
    });
  }
}
