import { RestService } from './../../../../services/rest/rest.service';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-details-referred',
  templateUrl: './details-referred.component.html',
  styleUrls: ['./details-referred.component.scss'],
})
export class DetailsReferredComponent implements OnInit, AfterContentChecked {
  @Input() id: any;
  public history: any = [
    {
      name: 'Movimientos',
      router: ['/', 'movements'],
    },
  ];

  public loadingButton = false;
  public loading: any;
  public referred: any;

  constructor(
    private http: HttpClient,
    public share: SharedService,
    private rest: RestService,
    private router: Router,
    public translate: TranslateService,
    private formBuilder: FormBuilder,
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
    this.rest.get(`referreds/${this.id}`).subscribe(
      (res: any) => {
        this.referred = res;
        this.loading = false;
      },
      (err: any) => {
        this.router.navigate(['/']);
      }
    );
  };

  eventTypeOperation(event: any) {
    // this.form.patchValue({ valueSelectType: null });
    // console.log(this.selectOperation);
  }
}
