import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { RestService } from 'src/app/services/rest/rest.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SharedService } from 'src/app/modules/shared/shared.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
  public form: FormGroup;
  response: any;
  loading: boolean;
  token: any;
  recover: any = true;

  constructor(
    private rest: RestService,
    private router: Router,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    public shared: SharedService,
    private routeActive: ActivatedRoute
  ) {
    this.token = routeActive.snapshot.params.token;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        id: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        confirmPass: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
      },
      { validator: this.checkPasswords }
    );

    if (this.token) {
      this.form.patchValue({ id: this.token });
    }
  }

  checkPasswords(group: FormGroup): any {
    // here we have the 'passwords' group
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPass').value;
    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmit() {
    this.rest
      .post(`reset`, this.form.value)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.router.navigate(['/', 'auth', 'login']);
      });
  }
}
