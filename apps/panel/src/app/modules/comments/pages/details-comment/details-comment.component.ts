import { RestService } from './../../../../services/rest/rest.service';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../../shared/shared.service';


@Component({
  selector: 'app-details-comment',
  templateUrl: './details-comment.component.html',
  styleUrls: ['./details-comment.component.scss']
})
export class DetailsCommentComponent implements OnInit {

  @Input() id: any;
  public history: any = [
    {
      name: 'Comentarios',
      router: ['/', 'comments'],
    },
  ];

  public loading: any;
  public comment: any;

  constructor(
    public share: SharedService,
    private rest: RestService,
    private router: Router,
    public translate: TranslateService,
    private cdref: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.rest.setActiveConfirmLeave = true;
    this.route.params.subscribe((params) => {
      this.id = params.id;
    });
    this.loadGeneral();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  loadGeneral = () => {
    this.loading = true;
    this.rest.get(`comments/${this.id}`).subscribe(
      (res: any) => {
        this.comment = res;
        this.loading = false;
      },
      () => {
        this.router.navigate(['/']);
      }
    );
  };
}
