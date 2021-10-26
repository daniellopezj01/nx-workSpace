import { AuthService } from './../../../../services/auth/auth.service';
import { RestService } from './../../../../services/rest/rest.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {
  faGoogle,
  faFacebookF,
  faSlack,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';

import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // options: AnimationOptions = {
  //   path: '/assets/images/29481-kanban-image-animation.json',
  // };
  public form: FormGroup;
  public loading = false;
  public faEye = faEye;
  public faEyeSlash = faEyeSlash;
  public faGoogle = faGoogle;
  public faFacebookF = faFacebookF;
  public faLinkedinIn = faLinkedinIn;
  public faSlack = faSlack;
  public urlOauth = {
    fb: '',
    google: '',
    linkedin: '',
    slack: '',
  };

  public showPass = false;

  constructor(
    private rest: RestService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.checkErrors();
    // const tenant = window.location.host.split('.')[0];
    // this.urlOauth.fb = `${environment.oauth}/login-facebook?tenant=${tenant}`;
    // this.urlOauth.google = `${environment.oauth}/login-google?tenant=${tenant}`;
    // this.urlOauth.slack = `${environment.oauth}/login-slack?tenant=${tenant}`;
    // this.urlOauth.linkedin = `${environment.oauth}/login-linkedin?tenant=${tenant}`;
    this.auth.checkSession(true, true).then((a) => this.router.navigate(['/']));
  }

  checkErrors = () => {
    this.route.queryParams.subscribe((params) => {
      if (params.error) {
        this.rest.showToast('LOGIN.ERRORS.USER_DOES_NOT_EXIST');
      }
    });
  };

  onSubmit = () => {
    this.loading = true;
    this.auth
      .login(this.form.value)
      .then((res: any) => {
        this.loading = false;
        const { accessToken } = res;
        this.exchange(accessToken);
      })
      .catch(() => {
        this.loading = false;
        this.checkErrors();
      });
  };

  public exchange = (accessToken: string) => {
    this.auth
      .exchange({ accessToken })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (res: any) => {
          const { user } = res
          if (user.role === 'admin') {
            this.auth.setterSettings(res);
            this.loading = false;
            this.router.navigate(['/']).then();
          } else {
            this.rest.showToast('UNAUTHORIZED');
          }
        },
        () => {
          this.form.reset();
        }
      );
  };
}
