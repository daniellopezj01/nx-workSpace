import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RestService } from '../../../core/services/rest.service';
@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private rest: RestService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.generateToken();
  }

  generateToken = () => {
    this.route.queryParams.subscribe((params) => {
      const { token = '' } = params;
      const object = { accessToken: token };
      this.checkSessionByToken(object);
    });
  }

  checkSessionByToken = (objectAccessToken: any) => {
    try {
      // this.cookieService.set(
      //   'session',
      //   token,
      //   environment.daysTokenExpire,
      //   '/'
      // );
      this.rest.post(`exchange`, objectAccessToken, true, { ignoreLoadingBar: '' }).subscribe(
        (res) => {
          this.rest.setterSettings(res);
          this.rest.redirectAfterLogin();
        },
        (err) => {
          this.rest.logOut();
          this.rest.redirectLogin();
        }
      );
    } catch (e) {
      this.rest.logOut();
      this.rest.redirectLogin();
    }
  }
}
