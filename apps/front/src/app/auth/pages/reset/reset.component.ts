import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent {
  private subReset = false;
  public data: any = {};
  public passwordForm: FormGroup;
  public email = '';
  public loading = false;
  public showError = false;
  public showPass = false;

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(
    private active: ActivatedRoute,
    private rest: RestService,
    private router: Router,
    private cookies: CookieService,
    private formBuilder: FormBuilder,
    private library: FaIconLibrary
  ) {
    library.addIcons(faEye, faEyeSlash);
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.data.id = this.active.snapshot.params.id;
    if (this.cookies.check('emailChange')) {
      this.email = this.cookies.get('emailChange');
    }
    // else {
    //   this.router.navigate(['/auth/login']);
    // }
  }


  validateinput(control: any) {
    return (
      (!control.pristine && control.errors) || (this.subReset && control.errors)
    );
  }

  get f() {
    return this.passwordForm.controls;
  }

  changePassword() {
    this.subReset = true;
    this.loading = true;
    this.rest.post('reset', this.data).subscribe(
      (res: any) => {
        this.router.navigate(['/auth/successChange']);
        this.loading = false;
      },
      (err) => {
        this.subReset = false;
        this.showError = true;
        this.loading = false;
      }
    );
  }
}
