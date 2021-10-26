import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { RestService } from '../../../core/services/rest.service';
import { OAuthService } from '../../../core/services/oauth.service';

@Component({
  selector: 'app-form-login-register',
  templateUrl: './form-login-register.component.html',
  styleUrls: ['./form-login-register.component.scss'],
})
export class FormLoginRegisterComponent implements OnInit {
  @Output() changeItem: EventEmitter<any> = new EventEmitter();
  @Output() actionLogin: EventEmitter<any> = new EventEmitter();
  @Output() actionRegister: EventEmitter<any> = new EventEmitter();
  @Input() formAction = true;
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public subRegister = false;
  public loading = false;
  urlOauth = {
    login: {
      fb: '',
      google: '',
    },
    register: {
      fb: '',
      google: '',
    },
  };
  extraErrors = {
    minlength: (res: any) =>
      `Use country abbreviation! (min ${res.requiredLength} chars)`,
    maxlength: 'Use country abbreviation! (max 3 chars)',
  };
  password: any;
  colors = ['#dc3545', '#dc772b', '#f5cb5c', '#a4b525', '#52b788'];

  constructor(
    private rest: RestService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cookies: CookieService,
    private activatedRoute: ActivatedRoute,
    private oauthService: OAuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      avatar: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // this.formAction = (this.router.url === '/auth/login');
  }

  change(key: boolean) {
    this.formAction = key;
    this.changeItem.emit(key);
    // this.location.replaceState(`/auth/${key ? 'login' : 'register'}`);
  }

  ngOnInit(): void {
    this.urlOauth.login.fb = this.createSocialUrl('login-facebook');
    this.urlOauth.login.google = this.createSocialUrl('login-google');
    this.urlOauth.register.fb = this.createSocialUrl('register-facebook');
    this.urlOauth.register.google = this.createSocialUrl('register-google');
    // this.urlOauth.login.fb = `${environment.serverOauth}/login-facebook?tenant=${environment.tenant}&redirect=${environment.webPage}/auth/callback`;
    // this.urlOauth.login.google = `${environment.serverOauth}/login-google?tenant=${environment.tenant}&redirect=${environment.webPage}/auth/callback`;
    // this.urlOauth.register.fb = `${environment.serverOauth}/register-facebook?tenant=${environment.tenant}&redirect=${environment.webPage}/auth/callback`;
    // this.urlOauth.register.google = `${environment.serverOauth}/register-google?tenant=${environment.tenant}&redirect=${environment.webPage}/auth/callback`;
    this.checkUser();

    this.getDataFromQuery();
  }

  createSocialUrl(mainRoute: any) {
    return `${environment.serverOauth}/${mainRoute}?tenant=${environment.tenant}&redirect=${environment.webPage}/auth/callback`
  }

  getDataFromQuery(): any {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.registerForm.patchValue({
        name: params?.name || null,
        surname: params?.lastName || null,
        email: params?.email || null,
        avatar: params?.avatar || null,
      });
    });
  }

  checkUser() {
    this.rest.checkSession(false, true).then(
      () => {
        // this.router.navigate([`/`]);
        this.rest.redirectAfterLogin();
      },
      (err) => {
        console.log('no hay ninguna sesion activa');
      }
    );
  }


  async login() {
    this.loading = true;
    this.oauthService
      .login(this.loginForm.value)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (res: any) => {
          const { accessToken } = res;
          this.exchange(accessToken);
        },
        ({ error }) => {
          console.log(error);
          this.chackError(error);
        }
      );
  }

  validateForms(form: FormGroup) {
    this.loading = true;
    return !form.invalid;
  }

  public exchange = (accessToken: string, key = 'login') => {
    this.oauthService
      .exchange({ accessToken })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (res: any) => {
          this.userInStorage(res);
          if (key === 'login') {
            this.actionLogin.emit(res);
          } else {
            // this.rest.redirectAfterLogin();
            this.actionRegister.emit(res);
          }
        },
        () => {
          this.loginForm.reset();
        }
      );
  }

  chackError(error: any) {
    const { msg } = error.errors.msg;
    this.rest.showToast(msg);
  }

  async register() {
    this.loading = true;
    this.oauthService
      .register(this.registerForm.value)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (res: any) => {
          const { accessToken } = res;
          this.change(true);
          this.exchange(accessToken, 'register');
        },
        ({ error }) => {
          this.chackError(error);
        }
      );
  }

  userInStorage(data: any) {
    const { token, user } = data;
    this.cookies.set('session', token, environment.daysTokenExpire, '/');
    this.cookies.set(
      'user',
      JSON.stringify(user),
      environment.daysTokenExpire,
      '/'
    );
    this.loading = false;
    // this.router.navigate(['/', 'profile']);
  }
}
