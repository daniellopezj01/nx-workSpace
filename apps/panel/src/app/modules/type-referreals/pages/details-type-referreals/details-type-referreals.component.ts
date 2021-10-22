import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest/rest.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import * as _ from 'lodash';

@Component({
  selector: 'app-details-type-referreals',
  templateUrl: './details-type-referreals.component.html',
  styleUrls: ['./details-type-referreals.component.scss']
})
export class DetailsTypeReferrealsComponent implements OnInit {
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  @Input() id: any;
  public history: any = [
    {
      name: 'Plan referidos',
      router: ['/', 'type-referrals'],
    },
  ];

  public loadingButton: boolean = false;
  public loading: any;
  public typeReferreals: any;

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
    this.rest.get(`referredSettings/${this.id}`).subscribe(
      (res) => {
        this.typeReferreals = res;
        this.loading = false;
      },
      (err) => {
        this.router.navigate(['/']);
      }
    );
  };

  eventTypeOperation(event) {
    // this.form.patchValue({ valueSelectType: null });
    // console.log(this.selectOperation);
  }

}
