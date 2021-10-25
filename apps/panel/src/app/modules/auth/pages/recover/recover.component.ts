import { AuthService } from './../../../../services/auth/auth.service';
import { RestService } from './../../../../services/rest/rest.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss'],
})
export class RecoverComponent {
  public form: FormGroup;
  public response: any;
  public loading = false;
  public token: any;

  constructor(
    private rest: RestService,
    private router: Router,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    public shared: SharedService,
    private routeActive: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit = () => {
    this.loading = true;
    this.rest
      .post('forgot', this.form.value)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.response = true;
        // this.router.navigate(['/login']).then();
      });
  };
}
