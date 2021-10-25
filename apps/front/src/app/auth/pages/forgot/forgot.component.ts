import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent {
  public subForget = false;
  public forgetForm: FormGroup;
  public loading = false;
  public showError = false;

  constructor(
    private translate: TranslateService,
    private cookies: CookieService,
    private router: Router,
    private formBuilder: FormBuilder,
    private rest: RestService
  ) {
    this.forgetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }



  validateinput(control: any) {
    return (
      (!control.pristine && control.errors) ||
      (this.subForget && control.errors)
    );
  }

  get f() {
    return this.forgetForm.controls;
  }

  resetPassword() {
    this.subForget = true;
    this.loading = true;
    if (this.forgetForm.invalid) {
      this.loading = false;
      return;
    }
    this.rest.post('forgot', this.forgetForm.value).subscribe(
      (res: any) => {
        this.showError = false;
        this.loading = false;
        this.router.navigate(['/auth/sendEmail']);
        this.cookies.set('emailChange', this.forgetForm.value.email, 7);
      },
      (err) => {
        console.log(err);
        this.loading = false;
        this.forgetForm.reset();
        this.showError = true;
        this.subForget = false;
      }
    );
  }
}
