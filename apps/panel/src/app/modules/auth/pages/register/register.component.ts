import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {
  faGoogle,
  faFacebookF,
  faSlack,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { finalize } from 'rxjs/operators';
import { RestService } from 'src/app/services/rest/rest.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  options: AnimationOptions = {
    path: '/assets/images/29481-kanban-image-animation.json',
  };
  public form: FormGroup;
  loading: boolean;
  public showPass: boolean;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faGoogle = faGoogle;
  faFacebookF = faFacebookF;
  faLinkedinIn = faLinkedinIn;
  faSlack = faSlack;

  constructor(
    private rest: RestService,
    private router: Router,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    public shared: SharedService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      name: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(12),
        ],
      ],
    });
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

  onSubmit = () => {
    this.loading = true;
    this.rest
      .post('register', this.form.value)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.loading = false;
        const { accessToken } = res;
        this.exchange(accessToken);
      });
  };

  chackError(error) {
    const { msg } = error.errors.msg;
    this.rest.showToast(msg);
  }

  public exchange = (accessToken) => {
    this.auth
      .exchange({ accessToken })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (res) => {
          this.loading = false;
          this.rest.showToast('CHECK_PENDING');
          this.form.reset();
        },
        (e) => {
          this.chackError(e)
          this.form.reset();
        }
      );
  };
}
