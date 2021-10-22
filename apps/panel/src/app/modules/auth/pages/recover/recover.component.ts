import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { RestService } from 'src/app/services/rest/rest.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SharedService } from 'src/app/modules/shared/shared.service';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss'],
})
export class RecoverComponent implements OnInit {
  public form: FormGroup;
  response: any;
  loading: boolean;
  token: any;

  constructor(
    private rest: RestService,
    private router: Router,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    public shared: SharedService,
    private routeActive: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit = () => {
    this.loading = true;
    this.rest
      .post('forgot', this.form.value)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.response = true;
        // this.router.navigate(['/login']).then();
      });
  };
}
