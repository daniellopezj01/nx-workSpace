import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/modules/shared/shared.service';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {

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
