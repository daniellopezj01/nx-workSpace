import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss'],
})
export class LoginRegisterComponent implements OnInit {
  formAction = false;
  public loading = false;
  public userReferred;
  constructor(
    private rest: RestService,
    private router: Router,
    private location: Location,
    private cookies: CookieService,
  ) {
    this.formAction = this.router.url === '/auth/login';
  }

  change(key: boolean) { }

  ngOnInit(): void {
    this.checkRefferer();
  }

  checkRefferer() {
    if (this.cookies.check('userReferred')) {
      this.loading = true;
      const referredCode = this.cookies.get('userReferred');
      this.rest.get(`users/public/${referredCode}`).subscribe(res => {
        this.userReferred = res;
        this.loading = false;
      }, err => {
        this.loading = false;
      });
    }

  }

  changeActiveRoute(event) {
    // this.location.replaceState(`/auth/${event ? 'login' : 'register'}`);
  }

  register(event) {
    this.rest.redirectAfterLogin();
    // this.router.navigate(['/']);
  }

  login(event) {
    // this.router.navigate(['/']);
    this.rest.redirectAfterLogin();
  }
}
