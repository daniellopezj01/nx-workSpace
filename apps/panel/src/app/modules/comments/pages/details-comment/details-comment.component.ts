import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { RestService } from 'src/app/services/rest/rest.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';


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
      (res) => {
        this.comment = res;
        this.loading = false;
      },
      (err) => {
        this.router.navigate(['/']);
      }
    );
  };
}
